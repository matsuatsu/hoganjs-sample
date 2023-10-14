import { useState, useEffect } from "react";
import "./App.css";
import { Box, TextField, Divider, Typography } from "@mui/material";
import Hogan from "hogan.js";

function App() {
  const [prompt, setPrompt] = useState("");
  const [args, setArgs] = useState<{ [key: string]: string }>({});
  const [renderedPrompt, setRenderesPrompt] = useState("");

  useEffect(() => {
    if (prompt.endsWith("{{")) {
      setPrompt(prompt + " arg }}");
    }
    const tree = Hogan.parse(Hogan.scan(prompt));
    const keys = tree.filter((t) => t.tag == "_v").map((t) => t.n);
    const newArgs: { [key: string]: string } = {};
    keys.map((key) => {
      if (key) {
        newArgs[key] = "";
      }
    });
    setArgs(newArgs);
  }, [prompt]);

  useEffect(() => {
    const template = Hogan.compile(prompt);
    const newArgs = { ...args };
    Object.keys(args).map((key) => {
      if (args[key] == "") {
        newArgs[key] = `{{${key}}}`;
      }
    });
    const rendered = template.render(newArgs);
    setRenderesPrompt(rendered);
  }, [args]);

  console.log(args);

  return (
    <Box width={"100%"}>
      <TextField
        label="template"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        multiline
        rows={5}
        fullWidth
      />
      <Divider sx={{ m: 2 }}></Divider>
      <Box display={"flex"}>
        <Box flexGrow={1} sx={{ whiteSpace: "pre-line" }} textAlign={"left"}>
          {renderedPrompt}
        </Box>
        <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
          <Box>[変数]</Box>
          {Object.entries(args).map(([key, value]) => {
            return (
              <>
                <TextField
                  label={key}
                  value={value}
                  onChange={(e) => setArgs({ ...args, [key]: e.target.value })}
                  sx={{ m: 1 }}
                />
              </>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
