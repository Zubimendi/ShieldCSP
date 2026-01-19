/**
 * Notification Service
 * Handles sending notifications via email, Slack, and Discord webhooks
 */

import { prisma } from '@/lib/prisma';

export type NotificationType = 
  | 'violation'
  | 'scan-failure'
  | 'scan-completion'
  | 'score-change';

export interface NotificationPayload {
  type: NotificationType;
  teamId: string;
  domainId?: string;
  domainName?: string;
  title: string;
  message: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

/**
 * Send notifications to all enabled channels for team members
 */
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  try {
    // Get all notification settings for team members
    const settings = await prisma.notificationSetting.findMany({
      where: {
        teamId: payload.teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Filter settings based on notification type and preferences
    const relevantSettings = settings.filter((setting) => {
      if (payload.type === 'violation' && !setting.notifyOnNewViolations) return false;
      if (payload.type === 'scan-failure' && !setting.notifyOnScanFailure) return false;
      if (payload.type === 'score-change' && !setting.notifyOnScoreChange) return false;
      
      // Check severity threshold for violations
      if (payload.type === 'violation' && payload.severity) {
        const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        const thresholdOrder = severityOrder[setting.violationSeverityThreshold as keyof typeof severityOrder] || 2;
        const payloadSeverityOrder = severityOrder[payload.severity] || 1;
        if (payloadSeverityOrder < thresholdOrder) return false;
      }

      return true;
    });

    // Send notifications in parallel
    await Promise.allSettled(
      relevantSettings.map((setting) => {
        const promises: Promise<void>[] = [];

        // Email notification
        if (setting.emailEnabled && setting.user.email) {
          promises.push(
            sendEmailNotification(setting.user.email, setting.user.name || 'User', payload)
          );
        }

        // Slack webhook
        if (setting.slackWebhookUrl) {
          promises.push(
            sendSlackNotification(setting.slackWebhookUrl, payload)
          );
        }

        // Discord webhook
        if (setting.discordWebhookUrl) {
          promises.push(
            sendDiscordNotification(setting.discordWebhookUrl, payload)
          );
        }

        return Promise.all(promises).then(() => {});
      })
    );
  } catch (error) {
    console.error('[Notification Service] Error sending notifications:', error);
    // Don't throw - notifications are non-critical
  }
}

/**
 * Send email notification (placeholder - integrate with email service)
 */
async function sendEmailNotification(
  email: string,
  name: string,
  payload: NotificationPayload
): Promise<void> {
  // TODO: Integrate with email service (SendGrid, Resend, AWS SES, etc.)
  // For now, log the email that would be sent
  
  const subject = `[ShieldCSP] ${payload.title}`;
  const body = `
Hello ${name},

${payload.message}

${payload.metadata ? JSON.stringify(payload.metadata, null, 2) : ''}

---
ShieldCSP Security Platform
  `.trim();

  console.log(`[Email Notification] To: ${email}`);
  console.log(`[Email Notification] Subject: ${subject}`);
  console.log(`[Email Notification] Body: ${body}`);

  // Example integration with a service like Resend:
  // if (process.env.RESEND_API_KEY) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       from: 'alerts@shieldcsp.io',
  //       to: email,
  //       subject,
  //       html: formatEmailBody(body, payload),
  //     }),
  //   });
  // }
}

/**
 * Send Slack webhook notification
 */
async function sendSlackNotification(
  webhookUrl: string,
  payload: NotificationPayload
): Promise<void> {
  try {
    const color = getSeverityColor(payload.severity);
    const emoji = getSeverityEmoji(payload.severity);

    const slackMessage = {
      text: `${emoji} ${payload.title}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${emoji} ${payload.title}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: payload.message,
          },
        },
        ...(payload.domainName ? [{
          type: 'context',
          elements: [{
            type: 'mrkdwn',
            text: `*Domain:* ${payload.domainName}`,
          }],
        }] : []),
        ...(payload.metadata ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(payload.metadata, null, 2) + '```',
          },
        }] : []),
      ],
      attachments: [
        {
          color,
          footer: 'ShieldCSP',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[Slack Notification] Error:', error);
    throw error;
  }
}

/**
 * Send Discord webhook notification
 */
async function sendDiscordNotification(
  webhookUrl: string,
  payload: NotificationPayload
): Promise<void> {
  try {
    const color = getSeverityColorDecimal(payload.severity);
    const emoji = getSeverityEmoji(payload.severity);

    const discordMessage = {
      embeds: [
        {
          title: `${emoji} ${payload.title}`,
          description: payload.message,
          color,
          fields: payload.domainName ? [
            {
              name: 'Domain',
              value: payload.domainName,
              inline: true,
            },
          ] : [],
          ...(payload.metadata ? {
            fields: [
              ...(payload.domainName ? [{
                name: 'Domain',
                value: payload.domainName,
                inline: true,
              }] : []),
              {
                name: 'Details',
                value: '```json\n' + JSON.stringify(payload.metadata, null, 2) + '\n```',
                inline: false,
              },
            ],
          } : {}),
          timestamp: new Date().toISOString(),
          footer: {
            text: 'ShieldCSP Security Platform',
          },
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[Discord Notification] Error:', error);
    throw error;
  }
}

function getSeverityColor(severity?: string): string {
  switch (severity) {
    case 'critical': return '#ff0000';
    case 'high': return '#ff8800';
    case 'medium': return '#ffbb00';
    case 'low': return '#00aaff';
    default: return '#808080';
  }
}

function getSeverityColorDecimal(severity?: string): number {
  switch (severity) {
    case 'critical': return 0xff0000;
    case 'high': return 0xff8800;
    case 'medium': return 0xffbb00;
    case 'low': return 0x00aaff;
    default: return 0x808080;
  }
}

function getSeverityEmoji(severity?: string): string {
  switch (severity) {
    case 'critical': return '🚨';
    case 'high': return '⚠️';
    case 'medium': return '⚡';
    case 'low': return 'ℹ️';
    default: return '📢';
  }
}
