/// <reference types="node" />
import { Stream } from 'stream';
import { WebAPICallOptions, WebAPIResultCallback, WebAPICallResult } from './WebClient';
/**
 * Generic method definition
 */
export default interface Method<MethodArguments extends WebAPICallOptions> {
    (options?: MethodArguments & AuxiliaryArguments): Promise<WebAPICallResult>;
    (options: MethodArguments & AuxiliaryArguments, callback: WebAPIResultCallback): void;
}
export interface AuxiliaryArguments {
    [unknownArg: string]: any;
}
export interface TokenOverridable {
    token?: string;
}
export interface CursorPaginationEnabled {
    limit?: number;
    cursor?: string;
}
export interface TimelinePaginationEnabled {
    oldest?: string;
    latest?: string;
    inclusive?: boolean;
}
export interface LocaleAware {
    include_locale?: boolean;
}
export interface Dialog {
    title: string;
    callback_id: string;
    elements: {
        type: 'text' | 'textarea' | 'select';
        name: string;
        label: string;
        optional?: boolean;
        placeholder?: string;
        value?: string;
        max_length?: number;
        min_length?: number;
        hint?: string;
        subtype?: 'email' | 'number' | 'tel' | 'url';
        options?: {
            label: string;
            value: string;
        }[];
    }[];
    submit_label?: string;
}
export interface MessageAttachment {
    fallback?: string;
    color?: 'good' | 'warning' | 'danger' | string;
    pretext?: string;
    author_name?: string;
    author_link?: string;
    author_icon?: string;
    title?: string;
    title_link?: string;
    text?: string;
    fields?: {
        title: string;
        value: string;
        short?: boolean;
    }[];
    image_url?: string;
    thumb_url?: string;
    footer?: string;
    footer_icon?: string;
    ts?: string;
    actions?: {
        type: string;
        text?: string;
    }[];
    callback_id?: string;
    mrkdwn_in?: ('pretext' | 'text' | 'fields')[];
}
export interface LinkUnfurls {
    [linkUrl: string]: MessageAttachment;
}
export declare type APITestArguments = {};
export declare type AppsPermissionsInfoArguments = TokenOverridable & {};
export declare type AppsPermissionsRequestArguments = TokenOverridable & {
    scopes: string;
    trigger_id: string;
};
export declare type AuthRevokeArguments = TokenOverridable & {
    test: boolean;
};
export declare type AuthTestArguments = TokenOverridable & {};
export declare type BotsInfoArguments = TokenOverridable & {
    bot?: string;
};
export declare type ChannelsArchiveArguments = TokenOverridable & {
    channel: string;
};
export declare type ChannelsCreateArguments = TokenOverridable & {
    name: string;
    validate?: boolean;
};
export declare type ChannelsHistoryArguments = TokenOverridable & TimelinePaginationEnabled & {
    channel: string;
    count?: number;
    unreads?: boolean;
};
export declare type ChannelsInfoArguments = TokenOverridable & LocaleAware & {
    channel: string;
};
export declare type ChannelsInviteArguments = TokenOverridable & {
    channel: string;
    user: string;
};
export declare type ChannelsJoinArguments = TokenOverridable & {
    name: string;
    validate?: boolean;
};
export declare type ChannelsKickArguments = TokenOverridable & {
    channel: string;
    user: string;
};
export declare type ChannelsLeaveArguments = TokenOverridable & {
    channel: string;
};
export declare type ChannelsListArguments = TokenOverridable & CursorPaginationEnabled & {
    exclude_archived: boolean;
    exclude_members: boolean;
};
export declare type ChannelsMarkArguments = TokenOverridable & {
    channel: string;
    ts: string;
};
export declare type ChannelsRenameArguments = TokenOverridable & {
    channel: string;
    name: string;
    validate?: boolean;
};
export declare type ChannelsRepliesArguments = TokenOverridable & {
    channel: string;
    thread_ts: string;
};
export declare type ChannelsSetPurposeArguments = TokenOverridable & {
    channel: string;
    purpose: string;
};
export declare type ChannelsSetTopicArguments = TokenOverridable & {
    channel: string;
    topic: string;
};
export declare type ChannelsUnarchiveArguments = TokenOverridable & {
    channel: string;
};
export declare type ChatDeleteArguments = TokenOverridable & {
    channel: string;
    ts: string;
    as_user?: boolean;
};
export declare type ChatGetPermalinkArguments = TokenOverridable & {
    channel: string;
    message_ts: string;
};
export declare type ChatMeMessageArguments = TokenOverridable & {
    channel: string;
    text: string;
};
export declare type ChatPostEphemeralArguments = TokenOverridable & {
    channel: string;
    text: string;
    user: string;
    as_user?: boolean;
    attachments?: MessageAttachment[];
    link_names?: boolean;
    parse?: 'full' | 'none';
};
export declare type ChatPostMessageArguments = TokenOverridable & {
    channel: string;
    text: string;
    as_user?: boolean;
    attachments?: MessageAttachment[];
    icon_emoji?: string;
    icon_url?: string;
    link_names?: boolean;
    mrkdwn?: boolean;
    parse?: 'full' | 'none';
    reply_broadcast?: boolean;
    thread_ts?: string;
    unfurl_links?: boolean;
    unfurl_media?: boolean;
    username?: string;
};
export declare type ChatUnfurlArguments = TokenOverridable & {
    channel: string;
    ts: string;
    unfurls: LinkUnfurls;
    user_auth_message?: string;
    user_auth_required?: boolean;
    user_auth_url?: string;
};
export declare type ChatUpdateArguments = TokenOverridable & {
    channel: string;
    text: string;
    ts: string;
    as_user?: boolean;
    attachments?: MessageAttachment[];
    link_names?: boolean;
    parse?: 'full' | 'none';
};
export declare type ConversationsArchiveArguments = TokenOverridable & {
    channel: string;
};
export declare type ConversationsCloseArguments = TokenOverridable & {
    channel: string;
};
export declare type ConversationsCreateArguments = TokenOverridable & {
    name: string;
    is_private?: boolean;
};
export declare type ConversationsHistoryArguments = TokenOverridable & CursorPaginationEnabled & TimelinePaginationEnabled & {
    channel: string;
};
export declare type ConversationsInfoArguments = TokenOverridable & LocaleAware & {
    channel: string;
};
export declare type ConversationsInviteArguments = TokenOverridable & {
    channel: string;
    users: string;
};
export declare type ConversationsJoinArguments = TokenOverridable & {
    channel: string;
};
export declare type ConversationsKickArguments = TokenOverridable & {
    channel: string;
    user: string;
};
export declare type ConversationsLeaveArguments = TokenOverridable & {
    channel: string;
};
export declare type ConversationsListArguments = TokenOverridable & CursorPaginationEnabled & {
    exclude_archived?: boolean;
    types?: string;
};
export declare type ConversationsMembersArguments = TokenOverridable & CursorPaginationEnabled & {
    channel: string;
};
export declare type ConversationsOpenArguments = TokenOverridable & {
    channel?: string;
    users?: string;
    return_im?: boolean;
};
export declare type ConversationsRenameArguments = TokenOverridable & {
    channel: string;
    name: string;
};
export declare type ConversationsRepliesArguments = TokenOverridable & CursorPaginationEnabled & TimelinePaginationEnabled & {
    channel: string;
    ts: string;
};
export declare type ConversationsSetPurposeArguments = TokenOverridable & {
    channel: string;
    purpose: string;
};
export declare type ConversationsSetTopicArguments = TokenOverridable & {
    channel: string;
    topic: string;
};
export declare type ConversationsUnarchiveArguments = TokenOverridable & {
    channel: string;
};
export declare type DialogOpenArguments = TokenOverridable & {
    trigger_id: string;
    dialog: Dialog;
};
export declare type DndEndDndArguments = TokenOverridable;
export declare type DndEndSnoozeArguments = TokenOverridable;
export declare type DndInfoArguments = TokenOverridable & {
    user: string;
};
export declare type DndSetSnoozeArguments = TokenOverridable & {
    num_minutes: number;
};
export declare type DndTeamInfoArguments = TokenOverridable & {
    users?: string;
};
export declare type EmojiListArguments = TokenOverridable;
export declare type FilesDeleteArguments = TokenOverridable & {
    file: string;
};
export declare type FilesInfoArguments = TokenOverridable & {
    file: string;
    count?: number;
    page?: number;
};
export declare type FilesListArguments = TokenOverridable & {
    channel?: string;
    user?: string;
    count?: number;
    page?: number;
    ts_from?: string;
    ts_to?: string;
    types?: string;
};
export declare type FilesRevokePublicURLArguments = TokenOverridable & {
    file: string;
};
export declare type FilesSharedPublicURLArguments = TokenOverridable & {
    file: string;
};
export declare type FilesUploadArguments = TokenOverridable & {
    channels?: string;
    content?: string;
    file?: Buffer | Stream;
    filename?: string;
    filetype?: string;
    initial_comment?: string;
    title?: string;
};
export declare type FilesCommentsAddArguments = TokenOverridable & {
    comment: string;
    file: string;
};
export declare type FilesCommentsDeleteArguments = TokenOverridable & {
    file: string;
    id: string;
};
export declare type FilesCommentsEditArguments = TokenOverridable & {
    comment: string;
    file: string;
    id: string;
};
export declare type GroupsArchiveArguments = TokenOverridable & {
    channel: string;
};
export declare type GroupsCreateArguments = TokenOverridable & {
    name: string;
    validate?: boolean;
};
export declare type GroupsCreateChildArguments = TokenOverridable & {
    channel: string;
};
export declare type GroupsHistoryArguments = TokenOverridable & CursorPaginationEnabled & TimelinePaginationEnabled & {
    channel: string;
    unreads?: boolean;
};
export declare type GroupsInfoArguments = TokenOverridable & LocaleAware & {
    channel: string;
};
export declare type GroupsInviteArguments = TokenOverridable & {
    channel: string;
    user: string;
};
export declare type GroupsKickArguments = TokenOverridable & {
    channel: string;
    user: string;
};
export declare type GroupsLeaveArguments = TokenOverridable & {
    channel: string;
};
export declare type GroupsListArguments = TokenOverridable & {
    exclude_archived?: boolean;
    exclude_members?: boolean;
};
export declare type GroupsMarkArguments = TokenOverridable & {
    channel: string;
    ts: string;
};
export declare type GroupsOpenArguments = TokenOverridable & {
    channel: string;
};
export declare type GroupsRenameArguments = TokenOverridable & {
    channel: string;
    name: string;
    validate?: boolean;
};
export declare type GroupsRepliesArguments = TokenOverridable & {
    channel: string;
    thread_ts: boolean;
};
export declare type GroupsSetPurposeArguments = TokenOverridable & {
    channel: string;
    purpose: string;
};
export declare type GroupsSetTopicArguments = TokenOverridable & {
    channel: string;
    topic: string;
};
export declare type GroupsUnarchiveArguments = TokenOverridable & {
    channel: string;
};
export declare type IMCloseArguments = TokenOverridable & {
    channel: string;
};
export declare type IMHistoryArguments = TokenOverridable & TimelinePaginationEnabled & {
    channel: string;
    count?: number;
    unreads?: boolean;
};
export declare type IMListArguments = TokenOverridable & CursorPaginationEnabled;
export declare type IMMarkArguments = TokenOverridable & {
    channel: string;
    ts: string;
};
export declare type IMOpenArguments = TokenOverridable & LocaleAware & {
    user: string;
    return_im?: boolean;
};
export declare type IMRepliesArguments = TokenOverridable & {
    channel: string;
    thread_ts?: string;
};
export declare type MigrationExchangeArguments = TokenOverridable & {
    users: string;
    to_old?: boolean;
};
export declare type MPIMCloseArguments = TokenOverridable & {
    channel: string;
};
export declare type MPIMHistoryArguments = TokenOverridable & TimelinePaginationEnabled & {
    channel: string;
    count?: number;
    unreads?: boolean;
};
export declare type MPIMListArguments = TokenOverridable;
export declare type MPIMMarkArguments = TokenOverridable & {
    channel: string;
    ts: string;
};
export declare type MPIMOpenArguments = TokenOverridable & {
    users: string;
};
export declare type MPIMRepliesArguments = TokenOverridable & {
    channel: string;
    thread_ts: string;
};
export declare type OAuthAccessArguments = {
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri?: string;
};
export declare type OAuthTokenArguments = {
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri?: string;
    single_channel?: '0' | '1';
};
export declare type PinsAddArguments = TokenOverridable & {
    channel: string;
    file?: string;
    file_comment?: string;
    timestamp?: string;
};
export declare type PinsListArguments = TokenOverridable & {
    channel: string;
};
export declare type PinsRemoveArguments = TokenOverridable & {
    channel: string;
    file?: string;
    file_comment?: string;
    timestamp?: string;
};
export declare type ReactionsAddArguments = TokenOverridable & {
    name: string;
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
};
export declare type ReactionsGetArguments = TokenOverridable & {
    full?: boolean;
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
};
export declare type ReactionsListArguments = TokenOverridable & {
    user?: string;
    count?: number;
    page?: number;
    full?: boolean;
};
export declare type ReactionsRemoveArguments = TokenOverridable & {
    name: string;
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
};
export declare type RemindersAddArguments = TokenOverridable & {
    text: string;
    time: string | number;
    user?: string;
};
export declare type RemindersCompleteArguments = TokenOverridable & {
    reminder: string;
};
export declare type RemindersDeleteArguments = TokenOverridable & {
    reminder: string;
};
export declare type RemindersInfoArguments = TokenOverridable & {
    reminder: string;
};
export declare type RemindersListArguments = TokenOverridable;
export declare type RTMConnectArguments = TokenOverridable & {
    batch_presence_aware?: boolean;
    presence_sub?: boolean;
};
export declare type RTMStartArguments = TokenOverridable & LocaleAware & {
    batch_presence_aware?: boolean;
    mpim_aware?: boolean;
    no_latest?: '0' | '1';
    no_unreads?: string;
    presence_sub?: boolean;
    simple_latest?: boolean;
};
export declare type SearchAllArguments = TokenOverridable & {
    query: string;
    count?: number;
    page?: number;
    highlight?: boolean;
    sort: 'score' | 'timestamp';
    sort_dir: 'asc' | 'desc';
};
export declare type SearchFilesArguments = SearchAllArguments;
export declare type SearchMessagesArguments = SearchAllArguments;
export declare type StarsAddArguments = TokenOverridable & {
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
};
export declare type StarsListArguments = TokenOverridable & {
    count?: number;
    page?: number;
};
export declare type StarsRemoveArguments = TokenOverridable & {
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
};
export declare type TeamAccessLogsArguments = TokenOverridable & {
    before?: number;
    count?: number;
    page?: number;
};
export declare type TeamBillableInfoArguments = TokenOverridable & {
    user?: string;
};
export declare type TeamInfoArguments = TokenOverridable;
export declare type TeamIntegrationLogsArguments = TokenOverridable & {
    app_id?: string;
    change_type?: string;
    count?: number;
    page?: number;
    service_id?: string;
    user?: string;
};
export declare type TeamProfileGetArguments = TokenOverridable & {
    visibility?: 'all' | 'visible' | 'hidden';
};
export declare type UsergroupsCreateArguments = TokenOverridable & {
    name: string;
    channels?: string;
    description?: string;
    handle?: string;
    include_count?: boolean;
};
export declare type UsergroupsDisableArguments = TokenOverridable & {
    usergroup: string;
    include_count?: boolean;
};
export declare type UsergroupsEnableArguments = TokenOverridable & {
    usergroup: string;
    include_count?: boolean;
};
export declare type UsergroupsListArguments = TokenOverridable & {
    include_count?: boolean;
    include_disabled?: boolean;
    include_users?: boolean;
};
export declare type UsergroupsUpdateArguments = TokenOverridable & {
    usergroup: string;
    channels?: string;
    description?: string;
    handle?: string;
    include_count?: boolean;
    name?: string;
};
export declare type UsergroupsUsersListArguments = TokenOverridable & {
    usergroup: string;
    include_disabled?: boolean;
};
export declare type UsergroupsUsersUpdateArguments = TokenOverridable & {
    usergroup: string;
    users: string;
    include_count?: boolean;
};
export declare type UsersConversationsArguments = TokenOverridable & CursorPaginationEnabled & {
    exclude_archived?: boolean;
    types?: string;
    user?: string;
};
export declare type UsersDeletePhotoArguments = TokenOverridable;
export declare type UsersGetPresenceArguments = TokenOverridable & {
    user: string;
};
export declare type UsersIdentityArguments = TokenOverridable;
export declare type UsersInfoArguments = TokenOverridable & LocaleAware & {
    user: string;
};
export declare type UsersListArguments = TokenOverridable & CursorPaginationEnabled & LocaleAware & {
    presence?: boolean;
};
export declare type UsersLookupByEmailArguments = TokenOverridable & {
    email: string;
};
export declare type UsersSetActiveArguments = TokenOverridable;
export declare type UsersSetPhotoArguments = TokenOverridable & {
    image: Buffer | Stream;
    crop_w?: number;
    crop_x?: number;
    crop_y?: number;
};
export declare type UsersSetPresenceArguments = TokenOverridable & {
    presence: 'auto' | 'away';
};
export declare type UsersProfileGetArguments = TokenOverridable & {
    include_labels?: boolean;
    user?: string;
};
export declare type UsersProfileSetArguments = TokenOverridable & {
    profile?: string;
    user?: string;
    name?: string;
    value?: string;
};
