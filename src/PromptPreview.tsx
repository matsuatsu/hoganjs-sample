import { Box, Button, TextField, Modal } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { extractVariables, renderTemplate } from "./templateEngine";

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
    return renderTemplate(prompt, variables);
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
      >
        <Box display={"flex"} flexDirection={"column"} height={"100%"}>
          <Box display={"flex"} flexGrow={1} height={"90%"}>
            <Box flexGrow={1} flexDirection={"column"} width={0.5}>
              <Box>[preview]</Box>
              <Box
                textAlign={"left"}
                sx={{ overflowY: "auto", height: 0.9, whiteSpace: "pre-line" }}
              >
                {previewPrompt}
              </Box>
            </Box>
            <Box
              flexGrow={1}
              display={"flex"}
              flexDirection={"column"}
              width={0.5}
              marginLeft={2}
            >
              <Box>[変数]</Box>
              <Box sx={{ overflowY: "auto", height: 0.9 }}>
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
                        sx={{ m: 1, width: 0.9 }}
                        multiline
                        maxRows={3}
                      />
                    </>
                  );
                })}
              </Box>
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
      </Box>
    </Modal>
  );
};
