import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css'],
})
export class EditUserDialogComponent {
  dialogRef = inject(MatDialogRef<EditUserDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [this.data?.name || '',],
      email: [this.data?.email || '', [ Validators.email]],
      phone: [this.data?.phone || '',],
      username: [this.data?.username || '',],
      addressStreet: [this.data?.addressStreet || '',],
      addressSuite: [this.data?.addressSuite || '',],
      addressCity: [this.data?.addressCity || '',],
      addressZipcode: [this.data?.addressZipcode || '',],
      addressGeoLat: [this.data?.addressGeoLat || '',],
      addressGeoLng: [this.data?.addressGeoLng || '',],
      website: [this.data?.website || '',],
      companyName: [this.data?.companyName || '',],
      companyCatchPhrase: [this.data?.companyCatchPhrase || '',],
      companyBs: [this.data?.companyBs || '',],
      age: [this.data?.age || '',],
      salary: [this.data?.salary || '',],
    });
  }

  saveChanges(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

