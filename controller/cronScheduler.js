const scheduler = require('node-schedule');
const Schedule = require('../model/cron_scheduler');
const ScheduleLock = require('../model/cron_scheduler_lock');
const moment = require('moment');

async function scheduleTask(tasks) {
    try {
        const schedules = [];
        for (const { identifier, expression, module, task, args } of tasks) {
            const existingSchedule = await Schedule.findOne({ identifier });
            if (!existingSchedule) {
                console.log("Creating Scheduled task :::> ", identifier, new Date());
                schedules.push(Schedule.create([{ identifier, expression, module, task, args }]));
            }
        };
        await Promise.all(schedules);
        initializeScheduledTasks()
    } catch (error) {
        console.log("Error scheduling task> ", error)
    }
}

async function initializeScheduledTasks() {
    // await Schedule.deleteMany({});
    try {
        const schedules = await Schedule.find();
        for (const schedule of schedules) {
            const _d = JSON.parse(schedule.expression);
            const _rule = new scheduler.RecurrenceRule();
            _rule.date = !!_d.date && typeof _d.date !== 'number' ? new scheduler.Range(_d.date.start, _d.date.end, _d.date.step) : _d.date === undefined ? null : _d.date;
            _rule.dayOfWeek = !!_d.dayOfWeek && typeof _d.dayOfWeek !== 'number' ? new scheduler.Range(_d.dayOfWeek.start, _d.dayOfWeek.end, _d.dayOfWeek.step) : _d.dayOfWeek === undefined ? null : _d.dayOfWeek;
            _rule.second = !!_d.second && typeof _d.second !== 'number' ? new scheduler.Range(_d.second.start, _d.second.end, _d.second.step) : _d.second === undefined ? 0 : _d.second;
            _rule.minute = !!_d.minute && typeof _d.minute !== 'number' ? new scheduler.Range(_d.minute.start, _d.minute.end, _d.minute.step) : _d.minute === undefined ? null : _d.minute;
            _rule.hour = !!_d.hour && typeof _d.hour !== 'number' ? new scheduler.Range(_d.hour.start, _d.hour.end, _d.hour.step) : _d.hour === undefined ? null : _d.hour;
            _rule.tz = _d.tz === undefined ? null : _d.tz;
            scheduler.scheduleJob(_rule, async () => {
                try {
                    const lock = await ScheduleLock.findOneAndUpdate({ identifier: schedule.identifier }, {
                        $setOnInsert: { expires_at: moment().toDate() }
                    }, { upsert: true, new: true })
                    if (lock) {
                        console.log("Running scheduled task :::> ", schedule.identifier, new Date())
                        let retry = 0;
                        const runTask = async () => {
                            const args = schedule.args && JSON.parse(schedule.args);
                            if (schedule.task) {
                                await require(schedule.module)[schedule.task](args);
                            } else await require(schedule.module)(args);
                        }
                        const taskRunner = () => {
                            return new Promise(resolve => {
                                try {
                                    resolve(runTask())
                                } catch (error) {
                                    console.log("Task failed :::> ", error.message)
                                    if (retry++ < 5) {
                                        console.log(`Retrying in ${(Math.pow(2, retry) * 1000) / 1000} secs...`,)
                                        setTimeout(() => {
                                            resolve(taskRunner())
                                        }, Math.pow(2, retry) * 1000)
                                    } else {
                                        console.log("Task failed all retry attempts")
                                        resolve();
                                    }
                                }
                            });
                        }
                        await taskRunner();
                        //Releasing lock
                        await ScheduleLock.deleteOne({ identifier: schedule.identifier });
                    } else {
                        console.log("Failed to aquire lock. Another instance is probably already running the task");
                    }
                } catch (e) {
                    console.log("Something went wrong handling lock", e);
                }
            });
        }
    } catch (error) {
        console.log("Error initialzing task > ", error)
    }
}
//TODO: May need to move to a more roburst solotion as scheduled tasks increases 
scheduleTask([
    //Schedule lottery draw at 15:00 UTC+0 everyday
    {
        identifier: 'lotteryDrawTask', expression: JSON.stringify({
            tz: "UTC",
            second: 0,
            minute: 0,
            hour: 15,
        }), module: './lotteryController.js', task: 'runLotteryDraw'
    },
    //Schedule Setting Eth start block at 14:55 UTC+0 everyday
    {
        identifier: 'lotteryDrawSetEthBlock', expression: JSON.stringify({
            tz: "UTC",
            second: 0,
            minute: 55,
            hour: 14,
        }), module: './lotteryController.js', task: 'setDeadlineBlock'
    },
    //Schedule Weekly Cashback
    {
        identifier: 'weeklyCashback', expression: JSON.stringify({
            tz: "UTC",
            dayOfWeek: 1,
            minute: 0,
            hour: 0,
        }), module: '../profile_mangement/week_cashback.js', task: 'handleWeeklyCashbackImplementation'
    },
    //Schedule Monthly Cashback
    {
        identifier: 'monthlyCashback', expression: JSON.stringify({
            tz: "UTC",
            date: 1,
            minute: 0,
            hour: 0,
        }), module: '../profile_mangement/monthlycashback.js', task: 'handleMonthlyCashbackImplementation'
    },
    //Schedule Recharge Cashback: Daily Frequency
    {
        identifier: 'rechargeDailyFrequencyCashback', expression: JSON.stringify({
            tz: "UTC",
            minute: 0,
            hour: 23,
        }), module: '../profile_mangement/rechargebonus.js', task: 'handleRechargeImplementation', args: JSON.stringify({
            frequency: "daily"
        })
    },
    //Schedule Recharge Cashback: Hourly Frequency
    {
        identifier: 'rechargeHourlyFrequencyCashback', expression: JSON.stringify({
            tz: "UTC",
            minute: 0,
            hour: {
                start: 0, end: 23, step: 1
            },
        }), module: '../profile_mangement/rechargebonus.js', task: 'handleRechargeImplementation', args: JSON.stringify({
            frequency: "hourly"
        })
    },
    //Schedule Recharge Cashback: Flash Charge Frequency
    {
        identifier: 'rechargeFlashFrequencyCashback', expression: JSON.stringify({
            tz: "UTC",
            minute: {
                start: 0, end: 59, step: 10
            },
        }), module: '../profile_mangement/rechargebonus.js', task: 'handleRechargeImplementation', args: JSON.stringify({
            frequency: "flash_charge"
        })
    },
    //Schedule Recharge Period Reset: Runs daily to end users recharge period that are due
    {
        identifier: 'rechargePeriodEnd', expression: JSON.stringify({
            tz: "UTC",
            minute: 0,
            hour: 0,
        }), module: '../profile_mangement/rechargebonus.js', task: 'handleEndRechargePeriod'
    }
]);
/*
scheduleTask([
    {
        identifier: 'lotteryDrawTask', expression: JSON.stringify({
            tz: "UTC",
            second: 0,
            minute: {
                start: 8, end: 59, step: 8
            },
        }), module: './lotteryController.js', task: 'runLotteryDraw'
    },
    { identifier: 'lotteryDrawSetEthBlock', expression: JSON.stringify({
        tz: "UTC",
        second: 0,
        minute: {
            start: 3, end: 59, step: 3
        },
    }), module: './lotteryController.js', task: 'setDeadlineBlock' }
]);*/

process.on('SIGINT', function () {
    scheduler.gracefulShutdown().then(() => process.exit(0))
});