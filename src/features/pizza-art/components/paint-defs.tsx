import { PAINT_DEFS } from "../paint-defs";

/** Mount once per page: live pizza SVGs reference these gradients and filters by id. */
export function PaintDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs dangerouslySetInnerHTML={{ __html: PAINT_DEFS }} />
    </svg>
  );
}
