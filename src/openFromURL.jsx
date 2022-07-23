import { useState } from "react"
import { Form, Action, ActionPanel, showHUD } from "@raycast/api";

export default function Command() {
  const [formData, setFormData] = useState({url: "", urlError: null});

  const makeURL = () => {
    const prefix = `https://pika.style/?utm_source=Pika%20for%20Raycast&use=`;

    if(!formData?.url?.startsWith("http://") && !formData?.url?.startsWith("https://")) {
      return `${prefix}https://${formData?.url}`;
    } else {
      return `${prefix}${formData?.url}`;
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open in Pika.style"
            url={makeURL()}
            onOpen={async () => await showHUD("Opening in Pika.style...")}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="url"
        error={formData?.urlError}
        title="Enter Website/Image URL"
        placeholder="website.com or website.com/landing.png"
        storeValue={true}
        value={formData?.url}
        onChange={(e) => {
          setFormData({
            url: e,
            urlError: !e?.length > 1 || e === "" ? "Invalid URL" : null,
          });
        }}
      />
    </Form>
  );
}
