export default interface PropertyDirectoryInterface {
    /** Unique identifier */
    id: string;
    /** Directory name */
    name: string;
    /** ISO timestamp when created */
    createdAt: string;
    /** ISO timestamp when last updated */
    updatedAt: string;
    /** Directory type */
    type: "top-level" | "subdirectory";
    /** Parent directory ID (if subdirectory) */
    parent_id?: string;
  }
  
  /**
   * Payload used when creating a new property directory
   */
  export interface CreatePropertyDirectoryInterface {
    /** Directory type */
    type: "top-level" | "subdirectory";
    /** Directory name */
    name: string;
    /** Parent directory ID (if subdirectory) */
    parent_id?: string;
  }