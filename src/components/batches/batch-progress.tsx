"use client";

import {
  getBatchStatusClassName,
  getBatchStatusLabel,
  isTerminalBatchStatus,
  toProgressBarValue,
} from "@/components/batches/batch-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { BatchProcess } from "@/types";

type BatchProgressCardProps = {
  batch: BatchProcess;
  onReset: () => void;
};

export function BatchProgressCard({ batch, onReset }: BatchProgressCardProps) {
  const terminal = isTerminalBatchStatus(batch.status);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{batch.originalFileName}</p>
          <p className="text-sm text-muted-foreground">
            {String(batch.processedItems)} / {String(batch.totalItems)}{" "}
            procesadas
          </p>
        </div>
        <Badge
          variant="outline"
          className={getBatchStatusClassName(batch.status)}
        >
          {getBatchStatusLabel(batch.status)}
        </Badge>
      </div>

      <Progress value={toProgressBarValue(batch.progressPercentage)}>
        <ProgressLabel>Progreso</ProgressLabel>
        <ProgressValue>
          {() => `${batch.progressPercentage}%`}
        </ProgressValue>
      </Progress>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Exitosas</dt>
          <dd className="mt-1 font-medium">{String(batch.successfulItems)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Fallidas</dt>
          <dd className="mt-1 font-medium">{String(batch.failedItems)}</dd>
        </div>
      </dl>

      {batch.failureMessage ? (
        <p className="text-sm text-destructive">{batch.failureMessage}</p>
      ) : null}

      {terminal ? (
        <Button type="button" variant="outline" onClick={onReset}>
          Procesar otro archivo
        </Button>
      ) : null}
    </div>
  );
}
