import React from "react";

interface Props {
  filename: string;
  renderToSTL: (
    linearDeflection: number,
    isRelative: boolean,
    angularDeflection: number
  ) => Promise<string>;
}

const STLDownload = React.memo<Props>(({ filename, renderToSTL }) => {
  const [linearDeflection, setLinearDeflection] = React.useState(0.05);
  const [isRelative, setIsRelative] = React.useState(false);
  const [angularDeflection, setAngularDeflection] = React.useState(0.5);

  const handleClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    renderToSTL(linearDeflection, isRelative, angularDeflection).then(
      (content) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(
          new Blob([content], { type: "model/stl" })
        );
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      }
    );
  };

  return (
    <form style={{ width: 640 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "1em 0",
        }}
      >
        <label htmlFor="linearDeflection">Linear Deflection</label>
        <input
          name="linearDeflection"
          value={linearDeflection}
          onInput={(event) =>
            setLinearDeflection(
              Number.parseFloat((event.target as HTMLInputElement).value)
            )
          }
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "1em 0",
        }}
      >
        <label htmlFor="isRelative">Relative Linear Deflection</label>
        <input
          name="isRelative"
          type="checkbox"
          checked={isRelative}
          onChange={(event) => setIsRelative(event.target.checked)}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "1em 0",
        }}
      >
        <label htmlFor="angularDeflection">Angular Deflection</label>
        <input
          name="angularDeflection"
          value={angularDeflection}
          onInput={(event) =>
            setAngularDeflection(
              Number.parseFloat((event.target as HTMLInputElement).value)
            )
          }
        />
      </div>
      <button style={{ width: "100%" }} onClick={handleClick}>
        Download as STL
      </button>
    </form>
  );
});

export default STLDownload;
