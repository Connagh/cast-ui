import { View, StyleSheet } from 'react-native';
import { ThemeProvider, Button, DialogContent } from '@castui/cast-ui';

/**
 * Cast UI documentation site — first screen.
 *
 * A faithful build of the Figma mockup (file JGtlpxLPJMZcwvQ3UZ9ZUl, node
 * 1136-5735) using the real published @castui/cast-ui components. The point is
 * to prove the project structure and the design->code path before the full
 * design lands. As the design grows, add sections inside <View style={page}>.
 *
 * The one rule of Cast UI: wrap the app in <ThemeProvider> once near the root.
 * Every component reads its colours and spacing from that context.
 */
export function App() {
  return (
    <ThemeProvider>
      <View style={styles.page}>
        <Button intent="brand" prominence="bold" onPress={() => {}}>
          Design System Site Yaay
        </Button>

        <View style={styles.spacer} />

        <DialogContent
          icon="stadia_controller"
          title="Stinks"
          description="Stinks again"
          secondaryAction={{ label: 'Vanilla', onPress: () => {} }}
          primaryAction={{ label: 'Strawberry', onPress: () => {} }}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  // The page canvas. This matches the Figma frame background. It is the app's
  // own surface (not a themed Cast UI component), so the colour lives here
  // rather than coming from the theme.
  page: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 16,
    alignItems: 'flex-start',
  },
  spacer: {
    height: 16,
  },
});
