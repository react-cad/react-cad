define(["require", "exports", "./release_data"], function (
  require,
  exports,
  release_data_1
) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.latestSupportedTypeScriptVersion = exports.monacoTSVersions = void 0;
  /**
   * The versions of monaco-typescript which we can use
   * for backwards compatibility with older versions
   * of TS in the playground.
   */
  exports.monacoTSVersions = [...release_data_1.supportedReleases, "Latest"];
  /** Returns the latest TypeScript version supported by the sandbox */
  exports.latestSupportedTypeScriptVersion = Object.keys(
    exports.monacoTSVersions
  )
    .filter((key) => key !== "Nightly" && !key.includes("-"))
    .sort()
    .pop();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uYWNvVFNWZXJzaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NhbmRib3gvc3JjL21vbmFjb1RTVmVyc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUtBOzs7O09BSUc7SUFDVSxRQUFBLGdCQUFnQixHQUEwQixDQUFDLEdBQUcsZ0NBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFFdkYscUVBQXFFO0lBQ3hELFFBQUEsZ0NBQWdDLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBZ0IsQ0FBQztTQUNsRixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssU0FBUyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0RCxJQUFJLEVBQUU7U0FDTixHQUFHLEVBQUcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHN1cHBvcnRlZFJlbGVhc2VzLCBSZWxlYXNlVmVyc2lvbnMgfSBmcm9tICcuL3JlbGVhc2VfZGF0YSdcblxuLyoqIFRoZSB2ZXJzaW9ucyB5b3UgY2FuIGdldCBmb3IgdGhlIHNhbmRib3ggKi9cbmV4cG9ydCB0eXBlIFN1cHBvcnRlZFRTVmVyc2lvbnMgPSBSZWxlYXNlVmVyc2lvbnMgfCAnTGF0ZXN0J1xuXG4vKipcbiAqIFRoZSB2ZXJzaW9ucyBvZiBtb25hY28tdHlwZXNjcmlwdCB3aGljaCB3ZSBjYW4gdXNlXG4gKiBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCBvbGRlciB2ZXJzaW9uc1xuICogb2YgVFMgaW4gdGhlIHBsYXlncm91bmQuXG4gKi9cbmV4cG9ydCBjb25zdCBtb25hY29UU1ZlcnNpb25zOiBTdXBwb3J0ZWRUU1ZlcnNpb25zW10gPSBbLi4uc3VwcG9ydGVkUmVsZWFzZXMsICdMYXRlc3QnXVxuXG4vKiogUmV0dXJucyB0aGUgbGF0ZXN0IFR5cGVTY3JpcHQgdmVyc2lvbiBzdXBwb3J0ZWQgYnkgdGhlIHNhbmRib3ggKi9cbmV4cG9ydCBjb25zdCBsYXRlc3RTdXBwb3J0ZWRUeXBlU2NyaXB0VmVyc2lvbjogc3RyaW5nID0gT2JqZWN0LmtleXMobW9uYWNvVFNWZXJzaW9ucylcbiAgLmZpbHRlcihrZXkgPT4ga2V5ICE9PSAnTmlnaHRseScgJiYgIWtleS5pbmNsdWRlcygnLScpKVxuICAuc29ydCgpXG4gIC5wb3AoKSFcbiJdfQ==
