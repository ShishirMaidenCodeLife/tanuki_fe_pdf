"use client";

import {
  CommonModal,
  CommonPineappleImage,
  CommonToastContainer,
} from "@/components";
import { getAiSingleCallBody } from "@/config/api";
import { checkForValidRoutes } from "@/utils/methods/app";
import * as H from "@/hooks";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast, handleErrorToast } from "@/utils/methods/style";
import * as cleanups from "@/utils/pages/map/cleanups";
import * as events from "@/utils/pages/map/events";
import { toStartCase } from "@/utils/methods/string";
import { RoadmapCHNodeType } from "@/types";

// Clear Skills Button
export const ClearSkillsButton = () => {
  // Destructure
  // const { hideDialog, ...rest } = props;

  //Get the global store actions
  const { checkedNodes, setCheckedNodes } = H.useRoadmapStoreHook();

  // Variable: Check if the button is disabled
  const isDisabled = checkedNodes?.length === 0;

  // Action: Handle the reset button click
  const onActionClick = () => {
    setCheckedNodes([]);
    handleCustomToast(TOAST_MESSAGES.pages.map.skillsCleared);
    cleanups.clearMapCheckbox();
  };

  // Store
  return (
    <CommonToastContainer
      show={isDisabled}
      title={TOAST_MESSAGES.pages.map.noSkillsToClear.title}
    >
      <CommonModal
        actionBtnName="Ok"
        btnProps={{
          isDisabled,
          className: "_apply_custom_link",
        }}
        hideOkayDialog={true}
        name="Clear"
        title={
          <div className="grid place-items-center font-normal">
            <div>
              <CommonPineappleImage />
            </div>
            <div>Do you want to clear the checkbox selection?</div>
          </div>
        }
        // style={{ color }}
        onActionClick={onActionClick}
      />
    </CommonToastContainer>
  );
};

// Generate Route Button
export const GenerateRouteButton = () => {
  // Destructure
  const { checkedNodes, isMdLoading, setIsMdLoading } = H.useRoadmapStoreHook();

  // States
  // const [isLoading, setIsLoading] = useState(false);

  // Variable: Check if the button is disabled
  const isDisabled = checkedNodes?.length === 0;

  // Variable: Single AI Call Mutation
  const singleAiCallMutation = H.useMutationSingleCallHook();

  // Handlers
  const handleGenerateRoute = () => {
    const formData = checkedNodes
      ?.map(({ data }: RoadmapCHNodeType) => data?.name)
      .join(",");

    const errorText = checkForValidRoutes(formData);

    if (errorText.toString() !== "true") {
      handleErrorToast({ message: errorText });

      return;
    }

    setIsMdLoading(true);

    singleAiCallMutation.mutate(getAiSingleCallBody(formData));
  };

  // Store
  return (
    <CommonToastContainer
      show={isDisabled}
      title={TOAST_MESSAGES.pages.map.noSkillsToGenerate.title}
    >
      <CommonModal
        actionBtnName="Ok"
        actionBtnProps={{ isLoading: isMdLoading }}
        btnProps={{
          isDisabled,
          className: "_apply_custom_link",
        }}
        // hideOkayDialog={true}
        name="Generate"
        title={
          <div className="grid place-items-center font-normal">
            <CommonPineappleImage />
            <div>Do you want to generate the routes?</div>
          </div>
        }
        // style={{ color }}
        onActionClick={handleGenerateRoute}
      />
    </CommonToastContainer>
  );
};

// Reset button at the top of the Map Page
export const ZoomFocusButton = (props: { action: string }) => {
  // Destructure
  const { action } = props;
  const isActionReset = action === "reset";

  //Get the global store actions
  const roadmapStore = H.useRoadmapStoreHook();
  const { clearTidyPageMethods, tidyPageSvgTransform } = roadmapStore;
  const roadmapQueries = H.useQueryRoadmapHook();

  // Variable: Check if the button is disabled
  const { action: storedAction } = tidyPageSvgTransform;
  const isDisabled =
    ["reset"]?.includes(storedAction) || storedAction === action;

  // Action: Handle the reset button click
  const onActionClick = () => {
    events.handleZoom({
      action,
      roadmapQueries,
      roadmapStore,
    });

    // Clear the related methods if the action is reset
    if (isActionReset) {
      clearTidyPageMethods();
    }
  };

  //Handle the Ctrl + 0 key press
  // useKeyboardCtrlKeyHook("0", () => {
  //   if (isDisabled) {
  //     handleCustomToast(TOAST_MESSAGES.pages.map.centeredAlready);

  //     return;
  //   }
  //   events.handleZoom({
  //     action: "center",
  //     roadmapQueries,
  //     roadmapStore,
  //   });
  // });

  // Store
  return (
    <CommonToastContainer
      show={isDisabled}
      title={
        isActionReset
          ? TOAST_MESSAGES.pages.map.resetAlready.title
          : TOAST_MESSAGES.pages.map.centeredAlready.title
      }
    >
      <CommonModal
        actionBtnName="Ok"
        btnProps={{
          isDisabled,
          className: "_apply_custom_link",
        }}
        hideOkayDialog={true}
        name={toStartCase(action)}
        title={
          <div className="grid place-items-center font-normal">
            <div>
              <CommonPineappleImage />
            </div>
            <div>Do you want to {action.toLowerCase()} the page?</div>
          </div>
        }
        // style={{ color }}
        onActionClick={onActionClick}
      />
    </CommonToastContainer>
  );
};
