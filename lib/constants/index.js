import error from './error';
import user  from './user';
import task  from './task';
import site  from './site';
import clientResume  from './clientResume';

export default {
    ...user,
    ...task,
    ...error,
    ...site,
    ...clientResume,
};
