/**
 * The scope handed to every live example. Everything the library exports,
 * plus React and the React Native primitives, so a snippet can be pasted
 * straight into a real app file and work unchanged.
 */

import React from 'react';
import * as ReactNative from 'react-native';
import * as CastUI from '@castui/cast-ui';

const {
  View,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  useWindowDimensions,
} = ReactNative as Record<string, unknown> as typeof import('react-native');

export const liveScope: Record<string, unknown> = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useMemo: React.useMemo,
  useRef: React.useRef,
  useCallback: React.useCallback,
  View,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  useWindowDimensions,
  ...CastUI,
};

/** Every export name of the library — used to build Snack import lines. */
export const castExportNames = Object.keys(CastUI);
