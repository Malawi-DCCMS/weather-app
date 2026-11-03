# Troubleshooting Guide

## Build & Compilation Issues

### 1. Unresolved references

**Example:**
```
e: file:///...MainApplication.kt:17:21 Unresolved reference 'ReactNativeHostWrapper'
```

**Root Cause:** Transient build cache issue or missing Expo module configuration.

**Solution:** Perform a clean rebuild:
```bash
# Clear old Expo build caches
npx expo prebuild --clean

# Clean gradle cache
cd android
./gradlew clean
cd ..

# Rebuild
npm run android
```

**Note:** This error may be temporary and resolve after cache clearing. If it persists, check that your Expo version supports the required modules.

---

## Quick Reference: Common Fixes

| Issue | Quick Fix |
|-------|-----------|
| Android API mismatch | Correct API levels in `app.json` and clean the build |
| Gradle build failures | Try `./android/gradlew clean` first |

---

## Getting Help

If issues persist after following these steps:
1. Check the [Expo Documentation](https://docs.expo.dev)
2. Review [React Native Docs](https://reactnative.dev/docs/getting-started)
3. Check Android/Gradle build errors carefully (they usually indicate the root cause)
4. Run with `--verbose` flag for more detailed output: `npm run android -- --verbose`
