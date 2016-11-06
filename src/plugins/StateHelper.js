import { toHash } from '../utils/utils';

export default function StateHelper (fsm)
{
    var onPause = this.onPause.bind(this);
    var onModify = this.onModify.bind(this);
    this.data = {};
    this.fsm = fsm;
    this.fsm
        .on('change', this.onChange.bind(this))
        .on('pause', onPause)
        .on('resume', onPause)
        .on('add', onModify)
        .on('remove', onModify);
    this.reset();
    this.update();
}

StateHelper.prototype =
{
    fsm : null,

    data : null,

    update:function()
    {
        this.onChange();
        this.onPause();
        this.onModify();
    },

    reset: function ()
    {
        this.data =
        {
            name     : '',
            index    : -1,
            paused   : false,
            is       : {},
            actions  : {},
            states   : {},
            all:{
                states  :[],
                actions :[]
            }
        }
    },

    onPause:function(event)
    {
        this.data.paused        = this.fsm.isPaused();
    },

    onModify:function(event)
    {
        this.data.all.states    = this.fsm.transitions.getStates();
        this.data.all.actions   = this.fsm.transitions.getActions();
    },

    onChange:function(event)
    {
        var fsm                 = this.fsm;
        this.data.name          = fsm.state;
        this.data.index         = this.fsm.transitions.states.indexOf(this.data.name);
        this.data.states        = toHash(fsm.transitions.getToStates(fsm.state));
        this.data.actions       = toHash(fsm.transitions.getActionsFrom(fsm.state));
        this.data.is            = {};
        this.data.is[fsm.state] = true;
    }

};
