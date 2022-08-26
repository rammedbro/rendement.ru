export const PHYS_PERSON = 0;
export const LEGAL_PERSON = 1;

export const MALE_SEX = 0;
export const FEMALE_SEX = 1;

export const ADMIN_USER_GROUP = 0;
export const BASE_USER_GROUP = 1;

export const DEFAULT_GROUP_USER = 0;
export const CLIENT_GROUP_USER = 1;

export const WORK_EXPERIENCE_NONE = 0;
export const WORK_EXPERIENCE_SMALL = 1;
export const WORK_EXPERIENCE_MEDIUM = 2;
export const WORK_EXPERIENCE_LARGE = 3;
export const WORK_EXPERIENCE_LIST = [
    {
        text: 'Нет опыта',
        value: WORK_EXPERIENCE_NONE,
    },
    {
        text: 'От 1 года до 3 лет',
        value: WORK_EXPERIENCE_SMALL,
    },
    {
        text: 'От 3 до 6 лет',
        value: WORK_EXPERIENCE_MEDIUM,
    },
    {
        text: 'Более 6 лет',
        value: WORK_EXPERIENCE_LARGE,
    },
];

export default {
    PHYS_PERSON,
    LEGAL_PERSON,
    MALE_SEX,
    FEMALE_SEX,
    ADMIN_USER_GROUP,
    BASE_USER_GROUP,
    WORK_EXPERIENCE_NONE,
    WORK_EXPERIENCE_SMALL,
    WORK_EXPERIENCE_MEDIUM,
    WORK_EXPERIENCE_LARGE,
    WORK_EXPERIENCE_LIST,
    DEFAULT_GROUP_USER,
    CLIENT_GROUP_USER,
};
