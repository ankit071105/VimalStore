protected getToolbarButtons() {
    let buttons = super.getToolbarButtons();
  
    buttons.push({
        title: "Confirm Order",
        cssClass: 'edit-permissions-button', // you might want to change this
        icon: 'fa-download text-green', // you might want to change this
        onClick: () => {
            Q.confirm("Are you sure you want to do this?", () => {
                xyzService.ConfirmOrder({ EntityId: Number(this.entity.xyzId) },
                    response => {
                        Q.notifySuccess(response.Message);
                    }
                );
            },
            {
                htmlEncode: false,
                onNo: () => {
                    Q.warning("No action was taken.");
                }
            });
        }
    });
  
    return buttons;
  }

  buttons.push({
    title: 'Send Email',
    icon: "fa-envelope text-green",
    separator: false,
    onClick: () => {
        var volunteers: number[] = [];

        if (this.form.EmployeeID.value) {
            volunteers.push(Q.toId(this.form.EmployeeID.value));
        }

        var client = Q.tryFirst(CustomerRow.getLookup().items, x => x.CustomerID == this.form.CustomerID.value);
        var apptDate = this.form.OrderDate.valueAsDate.toString().substring(0,15);
        var subject = "Ride Scheduled for " + apptDate + " at " + this.form.RequiredDate.value + " with " + (client ? client.FullName : "");

        new Northwind.MailComposeDialog({
            mailFromTrip: true,
            toVoluntueer: volunteers,
            subject: subject,
            appointmentDate: this.form.OrderDate.valueAsDate,
            clientName: (client ? client.FullName : ""),
            rideNumber: this.form.OrderID.value,
            telephoneNumber: client.Phone,
            pickupTime: this.form.RequiredDate.value,
            pickupAddress: this.form.ShipAddress.value + " " + this.form.ShipCity.value + " " + this.form.ShipPostalCode.value,
            deliveryAddress: this.form.DestinationAddress.value + " " + this.form.DestinationCity.value + " " + this.form.DestinationZip.value,
            deliveryAddress2: this.form.DestinationAddress2.value + " " + this.form.DestinationCity2.value + " " + this.form.DestinationZip2.value,
            apptLength: this.form.ApptTime.value,
            apptType: this.form.ApptType.value,
            appointmentTime: this.form.AppointmentTime.value,
            apptLength2: this.form.ApptTime2.value,
            apptType2: this.form.ApptType2.value,
            appointmentTime2: this.form.AppointmentTime2.value,
            altPhone: client.AltPhone
        }).dialogOpen();
    }
});