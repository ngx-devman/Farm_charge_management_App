<template>
  <div>
    <h5>Add Fixed charge for {{ afm }}</h5>

    <form class="save-form" [formgroup]="saveForm">
      <p>
        <mat-form-field>
          <mat-label>kaek</mat-label>
          <input
            matinput=""
            value="{{kaek}}"
            formcontrolname="kaek"
            required=""
          />
          <mat-icon matsuffix="">sentiment_very_satisfied</mat-icon>
          <mat-error *ngif="f.kaek.errors">
            Kaek is <strong>required</strong></mat-error
          >
        </mat-form-field>
      </p>
      <p>
        <mat-form-field>
          <mat-label>Date</mat-label>
          <input
            matinput=""
            type="date"
            value=""
            formcontrolname="chargeDate"
            required=""
          />
          <mat-icon matsuffix="">sentiment_very_satisfied</mat-icon>
          <mat-error *ngif="f.chargeDate.errors"
            >Date is <strong>required</strong></mat-error
          >
        </mat-form-field>
      </p>
      <p>
        <mat-form-field>
          <mat-label>amount</mat-label>
          <input
            matinput=""
            type="text"
            value="{{amount}}"
            formcontrolname="amount"
            required=""
          />
          <mat-icon matsuffix="">sentiment_very_satisfied</mat-icon>
          <mat-error *ngif="f.amount.errors"
            >amount is <strong>required</strong></mat-error
          >
        </mat-form-field>
      </p>
      <div class="submit-wrapper">
        <button mat-flat-button="" color="accent" (click)="onSave()">
          <mat-spinner *ngif="saving"></mat-spinner>
          Save
        </button>
      </div>
    </form>
  </div>
</template>
<script>
export default {};
</script>
<style scoped></style>
