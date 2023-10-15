import { Box, Button, TextField, Modal } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export const extractVariables = (prompt: string): { [key: string]: string } => {
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
};

export const PromptPreview = ({
  open,
  setOpen,
  prompt,
  setRenderedPrompt,
}: {
  open: boolean;
  setOpen: (flag: boolean) => void;
  prompt: string;
  setRenderedPrompt: (renderedPrompt: string) => void;
}) => {
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [variables, setVariables] = useState<{ [key: string]: string }>({});

  const extractVariablesCallback = useCallback(() => {
    const variables = extractVariables(prompt);
    return variables;
  }, [prompt]);

  useEffect(() => {
    setVariables(extractVariablesCallback());
  }, [extractVariablesCallback]);

  const render = useCallback(() => {
    return prompt.replace(/{{(.*?)}}/g, (match, key) => {
      return variables[key] || match;
    });
  }, [prompt, variables]);

  useEffect(() => {
    setPreviewPrompt(render());
  }, [render]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 0.8,
          height: 0.8,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
        display={"flex"}
        flexDirection={"column"}
      >
        <Box display={"flex"} flexGrow={1}>
          <Box
            flexGrow={1.5}
            sx={{ whiteSpace: "pre-line" }}
            flexDirection={"column"}
          >
            <Box>[プレビュー]</Box>
            <Box textAlign={"left"}>{previewPrompt}</Box>
          </Box>
          <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
            <Box>[変数]</Box>
            {Object.entries(variables).map(([key, value]) => {
              return (
                <>
                  <TextField
                    key={key}
                    label={key}
                    value={value}
                    onChange={(e) =>
                      setVariables({
                        ...variables,
                        [key]: e.target.value,
                      })
                    }
                    sx={{ m: 1 }}
                    multiline
                    maxRows={3}
                  />
                </>
              );
            })}
          </Box>
        </Box>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            setOpen(false);
            setRenderedPrompt(previewPrompt);
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};
