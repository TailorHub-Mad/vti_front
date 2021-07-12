import { Text } from '@chakra-ui/react';
import React from 'react';

export default {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    variant: {
      options: [
        'd_xxs_regular',
        'd_xxs_medium',
        'd_xs_regular',
        'd_xs_medium',
        'd_s_regular',
        'd_s_medium',
        'd_m_regular',
        'd_m_medium',
        'd_l_regular',
        'd_l_medium',
      ],
      type: 'radio',
    },
    color: {
      options: ['blue',
        'yellow',
        'pale_yellow',
        'light_blue',
        'violete',
        'rose',
        'dark',
        'white',
        'grey',
        'light_grey',
        'error',
        'correct',
        'alert',
        'start'],
      type: 'radio',
    },
    casing: {options:["none", "uppercase"] , type:"radio"},
    text: 'Texto de prueba',
  },
};

const Default = ({ ...args }) => <Text {...args}>{args?.text}</Text>;

export const TextBasic = Default.bind({});

TextBasic.args = {
  variant: 'd_l_regular',
  color: 'black',
  casing: "uppercase",
  text: 'Texto de prueba',
};
