import { ToasterToast } from "./toast-types";
import { Dispatch } from "react";
import { Action } from "./toast-types";

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 3000;

export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const addToRemoveQueue = (toastId: string, dispatch: Dispatch<Action>) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const createToast = (
  props: Omit<ToasterToast, "id">,
  dispatch: Dispatch<Action>
) => {
  const id = genId();

  return {
    ...props,
    id,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open) dispatch({ type: "DISMISS_TOAST", toastId: id });
    },
  };
};