import { Component, OnInit } from '@angular/core';
import { MatFormField, MatHint, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
  MatTableModule
} from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

enum CombatOdds {
  OneToThree,
  OneToTwo,
  OneToOne,
  TwoToOne,
  ThreeToOne,
  FourToOne
}

enum CombatResults {
  a = 1,
  A = 2,
  d = 4,
  D = 8,
  R = 16
}

enum Location {
  Clear = 1,
  Mountain = 2,
  Desert = 4,
  River = 8,
  Volga = 16,
  City = 32,
}

enum CalculatorStates {
  WaitingForCalculation,
  CantFightInDeserts
}

class CombatResultsWithOdds {
  combatDifferentialRange: { from: number, to: number }
  oddsWithResult: OddsWithResult[]

  constructor(combatDifferentialRange: { from: number, to: number }, oddsWithResult: OddsWithResult[]) {
    this.combatDifferentialRange = combatDifferentialRange;
    this.oddsWithResult = oddsWithResult;
  }
}

class OddsWithResult {
  odds: CombatOdds
  result: CombatResults
  highlightedInTable: boolean = false;

  constructor(odds: CombatOdds, result: CombatResults) {
    this.odds = odds;
    this.result = result;
  }
}

const flagsToNames = (flags: number) =>
  Object.entries(CombatResults)
    .filter(([_, v]) => typeof v === "number" && (flags & (v as number)) !== 0)
    .map(([k]) => k);

@Component({
  selector: 'app-calculator',
  imports: [
    MatLabel,
    MatInput,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatHint,
    ReactiveFormsModule,
    SplitComponent,
    SplitAreaComponent,
    MatTable,
    MatTableModule,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    MatCheckbox
  ],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator implements OnInit {
  locations = [
    {view: $localize`В другом поле (не перечислено тут)`, value: Location.Clear},
    {view: $localize`В горах`, value: Location.Mountain},
    {view: $localize`В пустынях`, value: Location.Desert},
    {view: $localize`На реке`, value: Location.River},
    {view: $localize`На Волге`, value: Location.Volga},
    {view: $localize`В городе`, value: Location.City},
  ];

  oddsTable: CombatResultsWithOdds[] = [
    new CombatResultsWithOdds({from: Number.NEGATIVE_INFINITY, to: -7},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.a)]),
    new CombatResultsWithOdds({from: -6, to: -4},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.a),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.a | CombatResults.d)]),
    new CombatResultsWithOdds({from: -3, to: -1},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.a),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.a | CombatResults.d),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.a | CombatResults.d | CombatResults.R)]),
    new CombatResultsWithOdds({from: 0, to: 0},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.a),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.a | CombatResults.d),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.a | CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.d | CombatResults.R)]),
    new CombatResultsWithOdds({from: 1, to: 3},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.A | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.a),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.a | CombatResults.d),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.a | CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.a | CombatResults.D | CombatResults.R)]),
    new CombatResultsWithOdds({from: 4, to: 6},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.a),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.a | CombatResults.d),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.a | CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.a | CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.D | CombatResults.R)]),
    new CombatResultsWithOdds({from: 7, to: 9},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.a | CombatResults.d),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.a | CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.a | CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.D | CombatResults.R)]),
    new CombatResultsWithOdds({from: 10, to: 12},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.a | CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.a | CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.D | CombatResults.R)]),
    new CombatResultsWithOdds({from: 13, to: Number.POSITIVE_INFINITY},
      [new OddsWithResult(CombatOdds.OneToThree, CombatResults.d | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToTwo, CombatResults.a | CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.OneToOne, CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.TwoToOne, CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.ThreeToOne, CombatResults.D | CombatResults.R),
        new OddsWithResult(CombatOdds.FourToOne, CombatResults.D | CombatResults.R)])
  ]

  calculatorGroup = new FormGroup({
    attackManpower: new FormControl<number | null>(null),
    defenseManpower: new FormControl<number | null>(null),
    attackUnitsCount: new FormControl<number | null>(null),
    defenseUnitsCount: new FormControl<number | null>(null),
    attackModifier: new FormControl<number | null>(null),
    defenseModifier: new FormControl<number | null>(null),
    attackDiceRoll: new FormControl<number | null>(null),
    defenseDiceRoll: new FormControl<number | null>(null),
    defenseLocations: new FormControl<Location | null>(null)
  });

  combatOdds: CombatOdds | null = null;
  combatDifferential: number | null = null;
  currentActionsDescriptions: string[] = [];

  noCalculationMessage: CalculatorStates | null = CalculatorStates.WaitingForCalculation;
  columnsToDisplay = ['combatDifferential', 'oneToThree', 'oneToTwo', 'oneToOne', 'twoToOne', 'threeToOne', 'fourToOne'];

  ngOnInit(): void {
    this.calculatorGroup.valueChanges
      .subscribe(() => {
        this.calculatorValueChanges();
      });
  }

  resetAllValues() {
    this.calculatorGroup.reset();
  }

  calculatorValueChanges() {
    let defenseLocationsControl = this.calculatorGroup.controls.defenseLocations;
    let defenseLocationsValue = defenseLocationsControl.value;

    if (defenseLocationsValue != null) {
      if ((defenseLocationsValue & Location.Clear) === Location.Clear && defenseLocationsValue != Location.Clear) {
        this.calculatorGroup.controls.defenseLocations.setValue(Location.Clear);
      }
      if ((defenseLocationsValue & Location.Desert) === Location.Desert) {
        // В пустынях нельзя сражаться, даже если все остальные данные в форме правильные, см. памятку локаций
        this.noCalculationMessage = CalculatorStates.CantFightInDeserts;
        return;
      }
    }

    if (this.calculatorGroup.valid) {
      this.noCalculationMessage = null;

      let attackManpower = this.calculatorGroup.get("attackManpower")!.value!;
      let defenseManpower = this.calculatorGroup.get("defenseManpower")!.value!;

      let manpowerDifference = attackManpower / defenseManpower;
      let defenseLocation = this.calculatorGroup.get("defenseLocations")?.value;
      this.combatOdds = this.getCombatOdds(manpowerDifference, defenseLocation);

      let attackUnitsCount = this.calculatorGroup.get("attackUnitsCount")!.value!;
      let defenseUnitsCount = this.calculatorGroup.get("defenseUnitsCount")!.value!;

      let attackModifier = this.calculatorGroup.get("attackModifier")!.value!;
      let defenseModifier = this.calculatorGroup.get("defenseModifier")!.value!;

      let attackDiceRoll = this.calculatorGroup.get("attackDiceRoll")!.value!;
      let defenseDiceRoll = this.calculatorGroup.get("defenseDiceRoll")!.value!;

      let totalAttackStrength = attackDiceRoll * attackUnitsCount + attackModifier;
      let totalDefenseStrength = defenseDiceRoll * defenseUnitsCount + defenseModifier;
      this.combatDifferential = totalAttackStrength - totalDefenseStrength;

      this.oddsTable.forEach(x => x.oddsWithResult.forEach(y => y.highlightedInTable = false));
      let currentCombatOdds = this.oddsTable.find(x => x.combatDifferentialRange.from <= this.combatDifferential! && x.combatDifferentialRange.to >= this.combatDifferential!);
      if (currentCombatOdds == null) {
        this.noCalculationMessage = CalculatorStates.WaitingForCalculation;
        return;
      }

      let currentResult = currentCombatOdds.oddsWithResult.find(x => x.odds == this.combatOdds);
      if (currentResult == null) {
        this.noCalculationMessage = CalculatorStates.WaitingForCalculation;
        return;
      }
      currentResult.highlightedInTable = true;

      this.currentActionsDescriptions = this.getActionsDescriptions(currentResult.result);
    } else {
      this.noCalculationMessage = CalculatorStates.WaitingForCalculation;
    }
  }

  private getCombatOdds(manpowerDifference: number, defenseLocation: Location | null | undefined): CombatOdds {
    let combatOdds: CombatOdds;

    if (manpowerDifference < 1 / 2)
      combatOdds = CombatOdds.OneToThree;
    else if (manpowerDifference < 1)
      combatOdds = CombatOdds.OneToTwo;
    else if (manpowerDifference < 2)
      combatOdds = CombatOdds.OneToOne;
    else if (manpowerDifference < 3)
      combatOdds = CombatOdds.TwoToOne;
    else if (manpowerDifference < 4)
      combatOdds = CombatOdds.ThreeToOne;
    else
      combatOdds = CombatOdds.FourToOne;

    if (defenseLocation != null && defenseLocation != Location.Clear) {
      let flagsCount = this.countFlags(defenseLocation);
      combatOdds -= flagsCount;
      if (combatOdds < 0)
        combatOdds = 0;
    }

    return combatOdds;
  }

  private getActionsDescriptions(currentActions: CombatResults): string[] {
    let currentActionsDescriptions: string[] = [];

    if ((currentActions & CombatResults.a) === CombatResults.a) currentActionsDescriptions.push($localize`а - наибольшее по численности соединение атакующего становится дезорганизованным.`);
    if ((currentActions & CombatResults.A) === CombatResults.A) currentActionsDescriptions.push($localize`А - все соединения атакующего становятся дезорганизованными.`);
    if ((currentActions & CombatResults.d) === CombatResults.d) currentActionsDescriptions.push($localize`о - наибольшее по численности соединение обороняющегося становится дезорганизованным. Если обороняющееся соединение было единственным сгруппированным с гарнизоном и в результате было уничтожено, уничтожьте также и гарнизон.`);
    if ((currentActions & CombatResults.D) === CombatResults.D) currentActionsDescriptions.push($localize`О - все соединения атакующего становятся дезорганизованными. Если все соединения обороняющегося, сгруппированные с гарнизоном, были уничтожены, уничтожьте также и гарнизон.`);
    if ((currentActions & CombatResults.R) === CombatResults.R) currentActionsDescriptions.push($localize`ОТ - все соединения (кроме гарнизонов) отступают на 2 гекса. Гарнизоны уничтожаются. Этот результат относится к той стороне, чья буква указана перед ним.`);

    return currentActionsDescriptions;
  }

  toggleLocationFlag(flag: Location, emitEvent: boolean = true) {
    const value: number = this.calculatorGroup.controls.defenseLocations.value ?? 0;
    const newValue = (value & flag) ? (value & ~flag) : (value | flag);
    this.calculatorGroup.controls.defenseLocations.setValue(newValue, { emitEvent: emitEvent });
  }

  isLocationChecked(flag: Location) {
    return ((this.calculatorGroup.controls.defenseLocations.value ?? 0) & flag) === flag;
  }

  isLocationDisabled(flag: Location) {
    return flag !== Location.Clear && (this.calculatorGroup.controls.defenseLocations.value ?? 0 & Location.Clear) === Location.Clear;
  }

  countFlags(value: number): number {
    let v = value >>> 0;
    let count = 0;
    while (v) {
      v &= v - 1;
      count++;
    }
    return count;
  }


  protected readonly Number = Number;
  protected readonly flagsToNames = flagsToNames;
  protected readonly CalculatorStates = CalculatorStates;
}
