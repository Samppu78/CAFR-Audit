# Sandvik CAFR Audit v24 - mobile email/share test

EMAIL behavior:
1. On supported HTTPS mobile browsers, EMAIL opens the native share sheet with a self-contained audit report file attached. The user selects Outlook, Mail, Gmail, Teams, AirDrop, etc.
2. The share text shows the configured default recipients, serial number and audit date.
3. If file sharing is unavailable, the report file downloads first and then an addressed mailto draft opens with instructions to attach the downloaded file.
4. User cancellation is handled silently.

Important: Web apps cannot force a recipient into Outlook while also attaching a file through the native share sheet. The default addresses are therefore shown in the share text. The mailto fallback can pre-address the message but requires manual attachment.

Also included:
- HAZARDS above GENERAL, persisted in Save/Past Audits and printed in English.
- Mobile keyboard, 44px touch controls, iPhone safe areas, and Android keyboard-resize hints.
