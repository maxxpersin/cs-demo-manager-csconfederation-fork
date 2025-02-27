import { server } from 'csdm/server/server';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { deletePositions } from 'csdm/node/database/delete-positions';
import { deleteOrphanDemos } from 'csdm/node/database/demos/delete-orphan-demos';
import { deleteDemos } from 'csdm/node/database/demos/delete-demos';

export type OptimizeDatabasePayload = {
  clearPositions: boolean;
  clearOrphanDemos: boolean;
  clearDemos: boolean;
};

export async function optimizeDatabaseHandler({
  clearPositions,
  clearOrphanDemos,
  clearDemos,
}: OptimizeDatabasePayload) {
  try {
    if (clearPositions) {
      await deletePositions();
    }
    if (clearDemos) {
      await deleteDemos();
    } else if (clearOrphanDemos) {
      await deleteOrphanDemos();
    }

    server.sendMessageToRendererProcess({
      name: RendererServerMessageName.OptimizeDatabaseSuccess,
    });
  } catch (error) {
    logger.error('Error while optimizing database');
    logger.error(error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw errorMessage;
  }
}
