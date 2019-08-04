import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HistoryService} from '../utils/history.service';
import {Statistic} from '../utils/statistic';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  _statisticForm: FormGroup;
  statistic: Statistic = new Statistic();
  usedIngredients: StatisticData[] = [];
  // usedIngredients: Map<string, number> = new Map<string, number>();
  // soldDishes: Map<string, number> = new Map<string, number>();
  soldDishes: StatisticData[] = [];
  columnsToDisplay = ['name', 'count'];

  constructor(private fb: FormBuilder, private historyService: HistoryService) {
    this._statisticForm = fb.group({
      fromDate: fb.control(undefined, [Validators.required]),
      toDate: fb.control(undefined, [Validators.required])
    });
  }

  ngOnInit() {
  }

  getStatistic() {
    const from = new Date((this._statisticForm.value as {fromDate: string, toDate: string}).fromDate);
    const to = new Date((this._statisticForm.value as {fromDate: string, toDate: string}).toDate);
    this.historyService.getStatistic(from.getTime().toString(), to.getTime().toString())
      .subscribe((d: Statistic) => {
        this.statistic = d;
        let i = 0;
        let temp = [];
        for (const [key, value] of Object.entries(d.usedIngredients)) {
          temp[i] = {name: key, count: value};
          i++;
        }
        this.usedIngredients = temp;
        temp = [];
        i = 0;
        for (const [key, value] of Object.entries(d.soldDishes)) {
          temp[i] = {name: key, count: value};
          i++;
        }
        this.soldDishes = temp;
      });
  }
}

export interface StatisticData {
  name: string;
  count: number;
}
