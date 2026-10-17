import { useState } from "react";
import { Container, Title, Text, Select, Stack, Button } from "@mantine/core";
import scenarios from "../../data/scenarios.json";

export default function App() {
  const [provider, setProvider] = useState("kaiser");
  const [selectedScenario, setSelectedScenario] = useState(null);

  return (
    <Container size="xs" py={60}>
      <Stack gap="xl">
        <div>
          <Title order={1}>Care, step by step</Title>
          <Text c="dimmed" mt="xs">
            Understand your coverage and find your next step.
          </Text>
        </div>

        <Select
          label="Your insurance provider"
          data={[{ value: "kaiser", label: "Kaiser Permanente" }]}
          value={provider}
          onChange={setProvider}
          allowDeselect={false}
        />

        <Text size="sm" c="dimmed">
          Demo plan: 2026 KP DC Silver 3500
        </Text>

        <Stack gap="sm">
          <Title order={2} size="h3">
            What would you like help with?
          </Title>

          {scenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant={selectedScenario === scenario.id ? "filled" : "default"}
              color="teal"
              fullWidth
              size="md"
              h="auto"
              py="md"
              styles={{
                inner: { justifyContent: "flex-start" },
                label: {
                  whiteSpace: "normal",
                  textAlign: "left",
                },
              }}
              aria-pressed={selectedScenario === scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
            >
              {scenario.title}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
