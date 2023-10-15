import { useState, useCallback } from "react";
import "./App.css";
import { Box, Button, TextField, Divider } from "@mui/material";
import { PromptPreview } from "./PromptPreview";

function App() {
  const [prompt, setPrompt] = useState("");
  const [renderedPrompt, setRenderedPrompt] = useState("");
  const [open, setOpen] = useState(false);

  const extractVariables = useCallback(() => {
    const regex = /{{([^{}]+)}}/g;
    const matches = prompt.match(regex) || [];
    const keys = matches.map((match) => match.slice(2, -2).trim());
    const variables: { [key: string]: string } = {};
    keys.map((key) => {
      if (key) {
        variables[key] = "";
      }
    });
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
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            const variables = extractVariables();
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
