export type Variables = { [key: string]: string };

export const extractVariables = (prompt: string): Variables => {
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

export const renderTemplate = (
  template: string,
  variables: Variables
): string => {
  return template.replace(/{{(.*?)}}/g, (match, key) => {
    return variables[key.trim()] || match;
  });
};
