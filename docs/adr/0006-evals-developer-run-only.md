# Evals are developer-run only

Evals are started by developers from the CLI; there are no automatic eval runs in CI and no automatic judge scoring of production Runs, because every case costs real model spend. God Mode shows Eval Run results read-only and requires a passing Eval Run before an admin can activate a model for agent or Jev-routing features; workspaces never see evals. Production only collects free Feedback Signals, and developers import poorly rated Runs into Datasets by hand.
