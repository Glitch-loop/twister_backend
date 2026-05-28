import { WorkDayEntity } from "@/src/business-operation-route/core/entities/work-day.entity"

export class WorkDayAggregate {
    private _workDayInformation: WorkDayEntity|null = null;

    constructor(
         workDayInformation: WorkDayEntity|null
    ) {
        this._workDayInformation = workDayInformation;
    }

    startWorkDay(
        _id_Work_day: string, 
        _start_petty_cash: number, 
        _id_route: string,
        _id_user: string,
        _id_route_day: string,
        _initial_date?: Date,
    ): void {
        
        if (_start_petty_cash < 0) throw new Error("Petty cash cannot be negative.");

        const newWorkDay: WorkDayEntity = new WorkDayEntity(
            _id_Work_day,
            _initial_date === undefined ? new Date() : _initial_date,
            _id_route,
            _start_petty_cash,
            _id_route_day,
            _id_user,
            [],
            undefined,
            undefined,
            undefined
        );

        this._workDayInformation = newWorkDay;
    }

    finishWorkDay(finalPettyCash:number, finalDate: Date): void {

        if (!this._workDayInformation) throw new Error("Work day information is not set.");

        const { start_petty_cash, start_date } = this._workDayInformation;

        if (finalPettyCash < 0) throw new Error("Petty cash cannot be negative.");
        if (finalPettyCash < start_petty_cash) throw new Error("Final petty cash cannot be less than initial petty cash.");

        if (finalDate <= start_date) throw new Error("Finish date must be after start date.");

        const finishedWorkDay: WorkDayEntity = new WorkDayEntity(
            this._workDayInformation.id_work_day,
            this._workDayInformation.start_date,
            this._workDayInformation.id_route,
            this._workDayInformation.start_petty_cash,
            this._workDayInformation.id_route_day,
            this._workDayInformation.id_user,
            this._workDayInformation.notes,
            finalDate,
            finalPettyCash,
            undefined // Id pay stub is a different process.
        );

        this._workDayInformation = finishedWorkDay;
    }

    getWorkDayInformation(): WorkDayEntity {
        if (!this._workDayInformation) throw new Error("Work day information is not set.");
        return this._workDayInformation;
    }
}