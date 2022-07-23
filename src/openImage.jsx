import {
  Form,
  ActionPanel,
  showToast,
  ToastStyle,
  getPreferenceValues,
  Detail,
  Icon,
  Action,
  open
} from "@raycast/api";
import { Action$ } from "raycast-toolkit";
import { useState } from "react";
import { readFileSync, existsSync } from "fs";
import fetch from "node-fetch"


const processFile = async ({ file }) => {
  return new Promise(async (resolve, reject) => {
    if (!existsSync(file)) {
      return reject("File does not exist");
    }

    const contents = readFileSync(file, { encoding: "base64" });

    const result = await fetch(`http://localhost:3000/api/addPublicImage`, {
      method: "POST",
      body: JSON.stringify({
        baseData: contents,
      }),
    }).then(res => res.json());

    resolve(result)
  });
};

export default function Command() {
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  function handleSubmit() {
    setLoading(true);

    processFile({ file: input })
      .then(async (res) => {
        console.log("Res", res)
        await open(`https://pika.style/?use=${res?.url?.url}`);
      })
      .catch(error => {
        console.log("error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Form
      navigationTitle={isLoading ? "🤖 Processing your image hang on..." : "pika.style"}
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action$.SelectFile
            icon={Icon.Finder}
            title="Select Image From Finder..."
            prompt="Please select an image"
            type="public.image"
            shortcut={{ key: "o", modifiers: ["cmd"] }}
            onSelect={setInput}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="file"
        title="Select image"
        value={input}
        onChange={setInput}
        placeholder="Enter the file path, or press ⌘ O"
      />
    </Form>
  );
}