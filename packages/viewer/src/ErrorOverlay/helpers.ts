export const filenameWithoutLoaders = (filename = ""): string => {
  const index = filename.lastIndexOf("!");

  return index < 0 ? filename : filename.substring(index + 1);
};

export const filenameHasLoaders = (filename: string): boolean => {
  const actualFilename = filenameWithoutLoaders(filename);

  return actualFilename !== filename;
};

export const filenameHasSchema = (filename?: string): boolean => {
  return filename ? /^[\w]+:/.test(filename) : false;
};

export const isFilenameAbsolute = (filename: string | undefined): boolean => {
  const actualFilename = filenameWithoutLoaders(filename);

  if (actualFilename.indexOf("/") === 0) {
    return true;
  }

  return false;
};

export const makeUrl = (
  filename?: string,
  scheme?: string,
  line?: number,
  column?: number
): string => {
  const actualFilename = filenameWithoutLoaders(filename);

  if (filenameHasSchema(filename)) {
    return actualFilename;
  }

  let url = `file://${actualFilename}`;

  if (scheme === "vscode") {
    url = `${scheme}://file/${url}`;
    url = url.replace(/file:\/\/\//, ""); // visual studio code does not need file:/// in its scheme
    if (line && actualFilename === filename) {
      url = `${url}:${line}`;

      if (column) {
        url = `${url}:${column}`;
      }
    }
  } else if (scheme) {
    url = `${scheme}://open?url=${url}`;

    if (line && actualFilename === filename) {
      url = `${url}&line=${line}`;

      if (column) {
        url = `${url}&column=${column}`;
      }
    }
  }

  return url;
};

export const makeLinkText = (
  filename?: string,
  line?: number,
  column?: number
): string => {
  let text = filenameWithoutLoaders(filename);

  if (line && text === filename) {
    text = `${text}:${line}`;

    if (column) {
      text = `${text}:${column}`;
    }
  }

  return text;
};
