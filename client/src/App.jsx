import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Select,
  Stack,
  Button,
  Paper,
} from "@mantine/core";
import scenarios from "../../data/scenarios.json";
import templates from "../../data/templates.json";
import "./App.css";

function displayText(text = "") {
  return text.replace(/\{[a-z_]+\}/g, "Confirm with Kaiser");
}

function needsPlanFacts(step) {
  return ["who", "say", "why", "when"].some((field) =>
    /\{[a-z_]+\}/.test(step[field] ?? "")
  );
}

export default function App() {
  const [provider, setProvider] = useState("kaiser");
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenario = scenarios.find(
    (item) => item.id === selectedScenario
  );

  return (
    <Container size="xs" py={48} className="care-shell">
      <Stack gap="xl" className="care-card">
        <div className="care-heading">

          <div className="brand-row">
            <img
              className="brand-logo"
              src="/care-logo.png"
              alt=""
            />
            <Title order={1} className="care-title">
              Care, step by step
            </Title>
          </div>

          <Text c="dimmed" mt="xs">
            Insurance without the headache.
          </Text>
        </div>

        {scenario ? (
          <Stack gap="lg">
            <Button
              variant="subtle"
              color="teal"
              onClick={() => setSelectedScenario(null)}
              style={{ alignSelf: "flex-start" }}
            >
              ← Back to options
            </Button>

            <div>
              <Text className="eyebrow section-eyebrow">
                Your next steps
              </Text>
              <Title
                order={2}
                size="h3"
                className="scenario-title"
              >
                {scenario.title}
              </Title>
            </div>

            {scenario.templates.map((templateId) => {
              const template = templates.find(
                (item) => item.id === templateId
              );

              if (!template) {
                return (
                  <Text key={templateId} c="dimmed">
                    Guidance for this step is not available yet.
                  </Text>
                );
              }

              return (
                <Stack key={templateId} gap="md">
                  {template.steps.map((step, index) => {
                    const pending = needsPlanFacts(step);

                    return (
                      <Paper
                        key={`${templateId}-${index}`}
                        withBorder
                        p="lg"
                        radius="md"
                      >
                        <Stack gap="sm">
                          <Text fw={600}>
                            {displayText(step.who)}
                          </Text>

                          <Text size="sm" c="dimmed">
                            {displayText(step.when)}
                          </Text>

                          <Text className="eyebrow">
                            What to say
                          </Text>

                          <Text>
                            {displayText(
                              pending && step.fallbackSay
                                ? step.fallbackSay
                                : step.say
                            )}
                          </Text>

                          <Text size="sm" c="dimmed">
                            {pending
                              ? "Plan-specific details still need confirmation."
                              : step.why}
                          </Text>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              );
            })}
          </Stack>
        ) : (
          <>
            <Select
              label="Your insurance provider"
              data={[
                {
                  value: "kaiser",
                  label: "Kaiser Permanente",
                },
              ]}
              value={provider}
              onChange={setProvider}
              allowDeselect={false}
            />

            <Text
              size="sm"
              c="dimmed"
              className="plan-note"
            >
              Demo plan: 2026 KP DC Silver 3500
            </Text>

            <Stack gap="sm" className="scenario-section">
              <Text className="eyebrow section-eyebrow">
                Start here
              </Text>

              <Title
                order={2}
                size="h3"
                className="scenario-title"
              >
                What would you like help with?
              </Title>

              {scenarios.map((item) => (
                <Button
                  key={item.id}
                  variant="default"
                  fullWidth
                  size="md"
                  h="auto"
                  py="md"
                  className="scenario-button"
                  styles={{
                    inner: {
                      justifyContent: "flex-start",
                    },
                    root: {
                      transition:
                        "background-color 160ms ease, border-color 160ms ease, transform 160ms ease",
                    },
                    label: {
                      whiteSpace: "normal",
                      textAlign: "left",
                    },
                  }}
                  onClick={() =>
                    setSelectedScenario(item.id)
                  }
                >
                  {item.title}
                </Button>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
}