function getStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    return window.localStorage;
  } catch (error) {
    return null;
  }
}

export function getStorageItem(key) {
  const storage = getStorage();
  return storage ? storage.getItem(key) : null;
}

export function setStorageItem(key, value) {
  const storage = getStorage();
  if (storage) {
    storage.setItem(key, value);
  }
}

export function removeStorageItem(key) {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(key);
  }
}

export function getJsonStorageItem(key, fallback) {
  const value = getStorageItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    removeStorageItem(key);
    return fallback;
  }
}
