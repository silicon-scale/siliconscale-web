/** Shared overflow/stacking containment for embedded project screenshots (listing mockups + case study hero). */

export const PROJECT_SCREENSHOT_CONTAIN_CLASS = 'project-screenshot-contain'

export function ProjectScreenshotContainmentStyles() {
  return (
    <style>{`
      .project-screenshot-contain {
        overflow: hidden;
        isolation: isolate;
        contain: paint;
        position: relative;
        z-index: 0;
      }
      .project-screenshot-contain img,
      .project-screenshot-contain .work-browser-image {
        backface-visibility: hidden;
        transform: translateZ(0);
      }
    `}</style>
  )
}
