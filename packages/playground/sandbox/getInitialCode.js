var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
define(["require", "exports", "./vendor/lzstring.min"], function (
  require,
  exports,
  lzstring_min_1
) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getInitialCode = void 0;
  lzstring_min_1 = __importDefault(lzstring_min_1);
  /**
   * Grabs the sourcecode for an example from the query hash or local storage
   * @param fallback if nothing is found return this
   * @param location DI'd copy of document.location
   */
  const getInitialCode = (fallback, location) => {
    // Old school support
    if (location.hash.startsWith("#src")) {
      const code = location.hash.replace("#src=", "").trim();
      return decodeURIComponent(code);
    }
    // New school support
    if (location.hash.startsWith("#code")) {
      const code = location.hash.replace("#code/", "").trim();
      let userCode = lzstring_min_1.default.decompressFromEncodedURIComponent(
        code
      );
      // Fallback incase there is an extra level of decoding:
      // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
      if (!userCode)
        userCode = lzstring_min_1.default.decompressFromEncodedURIComponent(
          decodeURIComponent(code)
        );
      return userCode;
    }
    // Local copy fallback
    if (localStorage.getItem("sandbox-history")) {
      return localStorage.getItem("sandbox-history");
    }
    return fallback;
  };
  exports.getInitialCode = getInitialCode;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0SW5pdGlhbENvZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zYW5kYm94L3NyYy9nZXRJbml0aWFsQ29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUVBOzs7O09BSUc7SUFDSSxNQUFNLGNBQWMsR0FBRyxDQUFDLFFBQWdCLEVBQUUsUUFBa0IsRUFBRSxFQUFFO1FBQ3JFLHFCQUFxQjtRQUNyQixJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUN0RCxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2hDO1FBRUQscUJBQXFCO1FBQ3JCLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDckMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3ZELElBQUksUUFBUSxHQUFHLHNCQUFRLENBQUMsaUNBQWlDLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDL0QsdURBQXVEO1lBQ3ZELHFFQUFxRTtZQUNyRSxJQUFJLENBQUMsUUFBUTtnQkFBRSxRQUFRLEdBQUcsc0JBQVEsQ0FBQyxpQ0FBaUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQzlGLE9BQU8sUUFBUSxDQUFBO1NBQ2hCO1FBRUQsc0JBQXNCO1FBQ3RCLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1lBQzNDLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBRSxDQUFBO1NBQ2hEO1FBRUQsT0FBTyxRQUFRLENBQUE7SUFDakIsQ0FBQyxDQUFBO0lBdkJZLFFBQUEsY0FBYyxrQkF1QjFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGx6c3RyaW5nIGZyb20gXCIuL3ZlbmRvci9senN0cmluZy5taW5cIlxuXG4vKipcbiAqIEdyYWJzIHRoZSBzb3VyY2Vjb2RlIGZvciBhbiBleGFtcGxlIGZyb20gdGhlIHF1ZXJ5IGhhc2ggb3IgbG9jYWwgc3RvcmFnZVxuICogQHBhcmFtIGZhbGxiYWNrIGlmIG5vdGhpbmcgaXMgZm91bmQgcmV0dXJuIHRoaXNcbiAqIEBwYXJhbSBsb2NhdGlvbiBESSdkIGNvcHkgb2YgZG9jdW1lbnQubG9jYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEluaXRpYWxDb2RlID0gKGZhbGxiYWNrOiBzdHJpbmcsIGxvY2F0aW9uOiBMb2NhdGlvbikgPT4ge1xuICAvLyBPbGQgc2Nob29sIHN1cHBvcnRcbiAgaWYgKGxvY2F0aW9uLmhhc2guc3RhcnRzV2l0aChcIiNzcmNcIikpIHtcbiAgICBjb25zdCBjb2RlID0gbG9jYXRpb24uaGFzaC5yZXBsYWNlKFwiI3NyYz1cIiwgXCJcIikudHJpbSgpXG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChjb2RlKVxuICB9XG5cbiAgLy8gTmV3IHNjaG9vbCBzdXBwb3J0XG4gIGlmIChsb2NhdGlvbi5oYXNoLnN0YXJ0c1dpdGgoXCIjY29kZVwiKSkge1xuICAgIGNvbnN0IGNvZGUgPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoXCIjY29kZS9cIiwgXCJcIikudHJpbSgpXG4gICAgbGV0IHVzZXJDb2RlID0gbHpzdHJpbmcuZGVjb21wcmVzc0Zyb21FbmNvZGVkVVJJQ29tcG9uZW50KGNvZGUpXG4gICAgLy8gRmFsbGJhY2sgaW5jYXNlIHRoZXJlIGlzIGFuIGV4dHJhIGxldmVsIG9mIGRlY29kaW5nOlxuICAgIC8vIGh0dHBzOi8vZ2l0dGVyLmltL01pY3Jvc29mdC9UeXBlU2NyaXB0P2F0PTVkYzQ3OGFiOWMzOTgyMTUwOWZmMTg5YVxuICAgIGlmICghdXNlckNvZGUpIHVzZXJDb2RlID0gbHpzdHJpbmcuZGVjb21wcmVzc0Zyb21FbmNvZGVkVVJJQ29tcG9uZW50KGRlY29kZVVSSUNvbXBvbmVudChjb2RlKSlcbiAgICByZXR1cm4gdXNlckNvZGVcbiAgfVxuXG4gIC8vIExvY2FsIGNvcHkgZmFsbGJhY2tcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2FuZGJveC1oaXN0b3J5XCIpKSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2FuZGJveC1oaXN0b3J5XCIpIVxuICB9XG5cbiAgcmV0dXJuIGZhbGxiYWNrXG59XG4iXX0=
