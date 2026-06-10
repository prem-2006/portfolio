import { useRef } from 'react';

const OBJECT_NAMES = [
  'Keyboard',
  'NeuralNet',
  'LLMTokens',
  'CPU',
  'Globe',
  'DNAHelix',
  'Brain',
];

export default function useRandomObject() {
  const indexRef = useRef(Math.floor(Math.random() * OBJECT_NAMES.length));
  return {
    index: indexRef.current,
    name: OBJECT_NAMES[indexRef.current],
  };
}
