/**
 * Cookie consent card — shown over a scrim on first visit.
 *
 * Built entirely from Cast UI: Dialog supplies the overlay + card + action
 * row; Toggle, Text, and Divider build the "Manage settings" view.
 *
 * Flow:
 *   summary  Accept → persist consent, load Clarity, close.
 *            Manage settings → switch to the manage view.
 *   manage   Save preferences with analytics ON  → same as Accept.
 *            Save preferences with analytics OFF → close only. Nothing is
 *            stored and no cookies are set, so the card returns next visit.
 *            Back → return to the summary view.
 *
 * The Dialog is given no `onClose`, so the scrim is not dismissable — the
 * visitor answers with the buttons.
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Dialog, Divider, Text, Toggle, useTheme } from '@castui/cast-ui';
import { loadClarity, readConsent, saveConsent } from './consent';

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'summary' | 'manage'>('summary');
  const [analytics, setAnalytics] = useState(true);
  const { scheme } = useTheme();

  useEffect(() => {
    if (readConsent()) {
      // Consent was given on a previous visit — start Clarity straight away.
      loadClarity();
    } else {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    saveConsent();
    loadClarity();
    setOpen(false);
  };

  const savePreferences = () => {
    if (analytics) {
      accept();
    } else {
      // Declined: store nothing, set no cookies. The card shows again on the
      // next visit.
      setOpen(false);
    }
  };

  const manage = view === 'manage';

  return (
    <Dialog
      open={open}
      size="default"
      icon="cookie"
      title={manage ? 'Cookie settings' : 'Cookies on this site'}
      description={
        manage
          ? 'Choose which cookies this site may use. Your choice only takes effect when you save.'
          : 'We use Microsoft Clarity to understand how visitors use the site and improve it. No analytics cookies are set unless you accept.'
      }
      primaryAction={
        manage
          ? { label: 'Save preferences', onPress: savePreferences }
          : { label: 'Accept', onPress: accept }
      }
      secondaryAction={
        manage
          ? { label: 'Back', onPress: () => setView('summary') }
          : { label: 'Manage settings', onPress: () => setView('manage') }
      }
    >
      {manage ? (
        <View style={{ gap: 12 }}>
          <View style={{ gap: 4 }}>
            <Toggle checked disabled>
              Strictly necessary
            </Toggle>
            <Text type="body-sm" color={scheme.text.description}>
              Required for the site to work, including remembering this cookie
              choice. Always on.
            </Text>
          </View>
          <Divider />
          <View style={{ gap: 4 }}>
            <Toggle checked={analytics} onChange={setAnalytics}>
              Analytics (Microsoft Clarity)
            </Toggle>
            <Text type="body-sm" color={scheme.text.description}>
              Helps us see how the site is used — pages visited, clicks and
              scrolling — so we can improve it. Sets Microsoft Clarity cookies.
            </Text>
          </View>
        </View>
      ) : null}
    </Dialog>
  );
}
