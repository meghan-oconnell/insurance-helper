import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Select,
  Stack,
  Button,
  Paper,
  Alert,
  Accordion,
  Badge,
  Group,
} from "@mantine/core";
import scenarios from "../../data/scenarios.json";
import templates from "../../data/templates.json";
import "./App.css";

// Load every generated answer: { mri: {...}, therapy: {...} }
const answerFiles = import.meta.glob("./answers/*.json", { eager: true });
const answers = Object.fromEntries(
  Object.values(answerFiles).map((f) => [f.default.id, f.default]),
);

// Verified scenarios (have a generated answer) vs. previews (templates only)
const readyScenarios = scenarios.filter((s) => answers[s.id]);
const previewScenarios = scenarios.filter((s) => !answers[s.id]);

// Preview helpers: show template steps without unverified plan details
function displayText(text = "") {
  return text.replace(/\{[a-z_]+\}/g, "Confirm with Kaiser");
}

function needsPlanFacts(step) {
  return ["who", "say", "why", "when"].some((field) =>
    /\{[a-z_]+\}/.test(step[field] ?? ""),
  );
}

export default function App() {
  const [provider, setProvider] = useState("kaiser");
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenario = scenarios.find((item) => item.id === selectedScenario);
  const answer = selectedScenario ? answers[selectedScenario] : null;
  const sourceById = Object.fromEntries(
    (answer?.sources ?? []).map((s) => [s.id, s]),
  );

  return (
    <Container size="xs" py={48} className="care-shell">
      <Stack gap="xl" className="care-card">
        <div className="care-heading">
          <div className="brand-row">
            <img className="brand-logo" src="/care-logo.png" alt="" />
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
              <Text className="eyebrow section-eyebrow">Your next steps</Text>
              <Title order={2} size="h3" className="scenario-title">
                {scenario.title}
              </Title>
            </div>

            {answer ? (
              <>
                {answer.notice && <Alert color="yellow">{answer.notice}</Alert>}

                {/* Steps filled with verified plan facts */}
                <Stack gap="md">
                  {answer.steps.map((step) => (
                    <Paper key={step.id} withBorder p="lg" radius="md">
                      <Stack gap="sm">
                        <Text fw={600}>{step.who}</Text>
                        <Text size="sm" c="dimmed">
                          {step.when}
                        </Text>
                        <Text className="eyebrow">What to say</Text>
                        <Text>{step.say}</Text>
                        <Text size="sm" c="dimmed">
                          {step.why}
                        </Text>
                        {step.sourceIds?.length > 0 && (
                          <Text size="xs" c="teal">
                            ✓ From your plan, page{" "}
                            {step.sourceIds
                              .map((id) => sourceById[id]?.page)
                              .join(", ")}
                          </Text>
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                {/* Anything that couldn't be verified */}
                {answer.unknowns.length > 0 && (
                  <Stack gap="md">
                    <Text className="eyebrow section-eyebrow">
                      Confirm with Kaiser
                    </Text>
                    {answer.unknowns.map((u) => (
                      <Paper
                        key={u.stepId}
                        withBorder
                        p="lg"
                        radius="md"
                        bg="yellow.0"
                      >
                        <Stack gap="sm">
                          <Text fw={600}>⚠ {u.who}</Text>
                          <Text size="sm" c="dimmed">
                            {u.when}
                          </Text>
                          <Text className="eyebrow">What to ask</Text>
                          <Text>{u.say}</Text>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}

                {/* Exact plan quotes behind the answer */}
                {answer.sources.length > 0 && (
                  <Accordion variant="contained">
                    <Accordion.Item value="sources">
                      <Accordion.Control>
                        How I got this answer
                      </Accordion.Control>
                      <Accordion.Panel>
                        {answer.sources.map((s) => (
                          <Text key={s.id} size="sm" mb="xs">
                            Page {s.page}: “{s.quote}”
                          </Text>
                        ))}
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                )}
              </>
            ) : (
              <>
                <Alert color="gray">
                  Preview: these steps show the general process. Plan-specific
                  costs haven't been verified for this scenario yet.
                </Alert>

                <Stack gap="md">
                  {scenario.templates.map((templateId) => {
                    const template = templates.find((t) => t.id === templateId);
                    if (!template) return null;

                    return template.steps.map((step, index) => {
                      const pending = needsPlanFacts(step);
                      return (
                        <Paper
                          key={`${templateId}-${index}`}
                          withBorder
                          p="lg"
                          radius="md"
                        >
                          <Stack gap="sm">
                            <Text fw={600}>{displayText(step.who)}</Text>
                            <Text size="sm" c="dimmed">
                              {displayText(step.when)}
                            </Text>
                            <Text className="eyebrow">What to say</Text>
                            <Text>
                              {displayText(
                                pending && step.fallbackSay
                                  ? step.fallbackSay
                                  : step.say,
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
                    });
                  })}
                </Stack>
              </>
            )}
          </Stack>
        ) : (
          <>
            <Select
              label="Your insurance provider"
              data={[{ value: "kaiser", label: "Kaiser Permanente" }]}
              value={provider}
              onChange={setProvider}
              allowDeselect={false}
            />

            <Text size="sm" c="dimmed" className="plan-note">
              Demo plan: 2026 KP DC Silver 3500
            </Text>

            <Stack gap="sm" className="scenario-section">
              <Text className="eyebrow section-eyebrow">Start here</Text>
              <Title order={2} size="h3" className="scenario-title">
                What would you like help with?
              </Title>

              {[...readyScenarios, ...previewScenarios].map((item) => {
                const isPreview = !answers[item.id];
                return (
                  <Button
                    key={item.id}
                    variant="default"
                    fullWidth
                    size="md"
                    h="auto"
                    py="md"
                    className="scenario-button"
                    styles={{
                      inner: { justifyContent: "flex-start" },
                      root: {
                        transition:
                          "background-color 160ms ease, border-color 160ms ease, transform 160ms ease",
                      },
                      label: {
                        whiteSpace: "normal",
                        textAlign: "left",
                        width: "100%",
                      },
                    }}
                    onClick={() => setSelectedScenario(item.id)}
                  >
                    <Group justify="space-between" wrap="nowrap" w="100%">
                      <span>{item.title}</span>
                      {isPreview && (
                        <Badge variant="light" color="gray" size="sm">
                          Preview
                        </Badge>
                      )}
                    </Group>
                  </Button>
                );
              })}
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
}
