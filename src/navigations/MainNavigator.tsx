import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, {FC} from 'react';
import StackNavigator from './StackNavigator';

export const navigationRef = createNavigationContainerRef();

const RootContainer: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator />
    </NavigationContainer>
  );
};
export default RootContainer;
