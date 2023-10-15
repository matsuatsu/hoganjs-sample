import { useState, useCallback } from "react";
import "./App.css";
import { Box, Button, TextField, Divider, Chip } from "@mui/material";
import { PromptPreview, extractVariables } from "./PromptPreview";

function App() {
  const [prompt, setPrompt] = useState("");
  const [renderedPrompt, setRenderedPrompt] = useState("");
  const [open, setOpen] = useState(false);

  const extractVariablesCallback = useCallback(() => {
    const variables = extractVariables(prompt);
    return variables;
  }, [prompt]);

  return (
    <>
      <Box width={"100%"}>
        <TextField
          label="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          multiline
          rows={5}
          fullWidth
        />
        <Box textAlign={"left"}>
          変数：
          {Object.keys(extractVariables(prompt)).map((key) => {
            return <Chip sx={{ m: 1 }} label={key} variant="outlined" />;
          })}
        </Box>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            const variables = extractVariablesCallback();
            if (Object.keys(variables).length == 0) {
              setRenderedPrompt(prompt);
            } else {
              setOpen(true);
            }
          }}
          sx={{ m: 2 }}
        >
          Submit
        </Button>
        <Divider sx={{ m: 2 }}></Divider>
        <Box sx={{ whiteSpace: "pre-line" }} textAlign={"left"}>
          {renderedPrompt}
        </Box>
      </Box>
      <PromptPreview
        open={open}
        setOpen={setOpen}
        prompt={prompt}
        setRenderedPrompt={setRenderedPrompt}
      />
    </>
  );
}

export default App;
