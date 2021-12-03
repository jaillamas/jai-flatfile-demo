import { Component, ViewEncapsulation } from "@angular/core";
import { IDataHookResponse } from "@flatfile/adapter/build/main/obj.validation-response";
import FlatfileResults from "@flatfile/adapter/build/main/results";
import {
  FieldHookCallback,
  FlatfileMethods,
  ScalarDictionaryWithCustom
} from "@flatfile/angular";
import {
  IField,
  IStyleOverrides
} from "@flatfile/angular/lib/interfaces/settings";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements FlatfileMethods {
  readonly EMAIL_REGEX: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  title = "Fiix User Management - Flatfile Demo";

  customer = { userId: "12345" };

  licenseKey = "f7cce6e4-82c9-4efe-837d-2122be065677";

  settings = {
    type: "Users",
    title: "Bulk User Import",
    allowInvalidSubmit: false,
    allowCustom: false,
    fields: this._constructFields(),
    managed: true,
    styleOverrides: this._constructStyle()
  };

  settingsForEmailOptional = {
    type: "Users",
    title: "Bulk User Import",
    allowInvalidSubmit: false,
    allowCustom: false,
    fields: this._constructFields(false),
    managed: true,
    styleOverrides: this._constructStyle()
  };

  private _constructFields(isEmailRequired: boolean = true): IField[] {
    const conditionalFields: IField[] = [];
    if (isEmailRequired) {
      conditionalFields.push({
        key: "emailAddress",
        label: "Email Address",
        validators: [
          {
            validate: "regex_matches",
            regex: this.EMAIL_REGEX.source,
            error: "Please enter a valid email address"
          },
          { validate: "required", error: "Please enter a valid email address" },
          { validate: "unique", error: "This email is already in use" }
        ]
      });
    } else {
      conditionalFields.push(
        {
          key: "username",
          label: "Username",
          validators: [
            {
              validate: "required",
              error: "Please enter a valid email address"
            },
            { validate: "unique", error: "This email is already in use" }
          ]
        },
        {
          key: "emailAddress",
          label: "Email Address",
          validators: [
            {
              validate: "regex_matches",
              regex: this.EMAIL_REGEX.source,
              error: "Please enter a valid email address"
            },
            {
              validate: "unique",
              error: "This email is already in use"
            }
          ]
        }
      );
    }

    const commonFields: IField[] = [
      {
        key: "roleId",
        label: "Role",
        type: "select",
        options: [
          { value: "1", label: "Administrator" },
          { value: "2", label: "Manager" },
          { value: "3", label: "Technician" },
          { value: "4", label: "Logistics" },
          { value: "4", label: "Purchasing" }
        ],
        validators: [{ validate: "required" }]
      },
      { key: "fullName", label: "Full Name" },
      { key: "jobTitle", label: "Job Title" },
      { key: "personnelCode", label: "Personnel Code" },
      { key: "hourlyRate", label: "Hourly Rate" },
      { key: "addressCity", label: "City" },
      { key: "addressStateProvince", label: "State or Province" },
      { key: "addressCountry", label: "Country" },
      { key: "addressPostalCode", label: "Postal Code" }
    ];

    return [...conditionalFields, ...commonFields];
  }

  private _constructStyle(): IStyleOverrides {
    return {
      buttonHeight: "3rem",
      borderRadius: "0.25rem",
      primaryButtonColor: "#14499a",
      primaryButtonFontColor: "#ffffff",
      secondaryButtonColor: "#f2f7ff",
      secondaryButtonFontColor: "#14499a",
      noButtonColor: "#c15716",
      yesButtonColor: "#14499a",
      invertedButtonColor: "#14499a",
      errorColor: "#b60000",
      successColor: "#23c720",
      warningColor: "#b60000",
      fontFamily: "Muli, Helvetica, Arial, sans-serif"
    };
  }

  /*
   * @Input()'s
   */
  public fieldHooks: Record<string, FieldHookCallback> = {
    email: (values) => {
      return values.map(([item, index]) => [
        {
          value: item + "@",
          info: [{ message: "added @ after the email", level: "warning" }]
        },
        index
      ]);
    }
  };

  /*
   * 2-way binding handlers
   */
  onData(results: FlatfileResults): Promise<string> {
    let errorState = false;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (errorState) {
          reject("rejected - this text is controlled by the end-user");
          errorState = false;
        } else {
          resolve(
            "Flatfile upload successful - this text is controlled by the end-user"
          );
        }
      }, 3000);
    });
  }

  onRecordInit(
    record: ScalarDictionaryWithCustom,
    index: number
  ): IDataHookResponse | Promise<IDataHookResponse> {
    return {
      email: {
        value: record.email + "@",
        info: [{ message: "added @ on init", level: "info" }]
      }
    };
  }

  onRecordChange(
    record: ScalarDictionaryWithCustom,
    index: number
  ): IDataHookResponse | Promise<IDataHookResponse> {
    return {
      email: {
        value: record.email + "#",
        info: [{ message: "added # on change", level: "warning" }]
      }
    };
  }

  /*
   * @Output() handlers
   */
  onCancel(): void {
    console.log("canceled!");
  }
}
