import React from 'react';
export default function cache(fn) {
  try {
    return typeof React.cache === 'function' ? React.cache(fn) : fn;
  } catch {
    return fn;
  }
}