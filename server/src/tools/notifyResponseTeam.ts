import { actionsDb } from '../firebase/actions';
import { teamsDb } from '../firebase/teams';

export interface NotifyResponseTeamInput {
  incidentId: string;
  teamId: string;
  message: string;
  channel?: 'IN_APP' | 'SMS_SIMULATED' | 'RADIO_DISPATCH' | 'WHATSAPP_SIMULATED';
}

export interface NotifyResponseTeamOutput {
  notificationSent: boolean;
  notificationId: string;
  recipient: string;
  channel: string;
  message: string;
  timestamp: string;
  deliveryStatus: string;
}

export async function executeNotifyResponseTeam(
  input: NotifyResponseTeamInput
): Promise<NotifyResponseTeamOutput> {
  const team = teamsDb.getById(input.teamId);
  const recipient = team ? `${team.name} Field Commander` : 'Assigned Emergency Squad';
  const channel = input.channel || 'RADIO_DISPATCH';

  const notif = actionsDb.logNotification({
    incidentId: input.incidentId,
    teamId: input.teamId,
    recipient,
    channel,
    message: input.message,
    status: 'DELIVERED',
  });

  return {
    notificationSent: true,
    notificationId: notif.id,
    recipient,
    channel,
    message: input.message,
    timestamp: notif.timestamp,
    deliveryStatus: 'DELIVERED_TO_FIELD_TERMINAL',
  };
}
