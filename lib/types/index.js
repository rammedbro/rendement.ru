import profile  from './profile';
import task     from './task';
import executor from './executor';
import resume   from './resume';
import vacancy  from './vacancy';
import content  from './content';
import review   from './review';
import other    from './other';
import request  from './request';
import chat     from './chat';

export default {
    ...profile,
    ...task,
    ...executor,
    ...resume,
    ...vacancy,
    ...content,
    ...review,
    ...other,
    ...request,
    ...chat,
};