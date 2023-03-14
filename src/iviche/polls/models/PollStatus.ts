/* eslint-disable prettier/prettier */
export enum PollStatus {
  DRAFT = 'DRAFT',            // while the author works with a poll

  MODERATION = 'MODERATION',  // from point, when poll is sent to moderation

  PUBLISHED = 'PUBLISHED',

  DISCUSSION = 'DISCUSSION',  // once moderation is done and discussion started
                              // only for complex workflow; skipped in case of simple poll

  VOTING = 'VOTING',          // once moderation is done and voting has started or after discussion

  FINISHED = 'FINISHED',      // voting has finished, votes are not accepted,
                              // but analytics is not ready yet

  COMPLETED = 'COMPLETED',    // voting has finished and analytics is ready

  REJECTED = 'REJECTED',      // moderation has finished and the poll was rejected
}
