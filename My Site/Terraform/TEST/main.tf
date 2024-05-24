// heredoc string --------------------------------------------
// -----------------------------------------------------------
// resource "local_file" "testFile" {
//   filename = "./myFile.txt"
//   content  = <<-EOT
//     This is some heredoc string
//     addition line
//     another line
//   EOT
// }


// interpolation ---------------------------------------------
// -----------------------------------------------------------
// resource "local_file" "testFile" {
//   filename = "./myFile.txt"
//   content  = <<-EOT
//     This is some heredoc string
//     ${var.line.one}
//     ${var.line.two}
//   EOT
// }

// variable "line" {
//   type = map(string)
//   default = {
//     one = "First line"
//     two = "second line"
//   }
// }


// conditional directive -------------------------------------
// -----------------------------------------------------------
// output "test" {
//   value = "Hello, %{ if var.sally != "" }${var.sally}%{ else }[no name provided]%{ endif }!"
// }

// variable "sally" {
//   type = string
// }



// loop directive --------------------------------------------
// -----------------------------------------------------------
// output "test" {
//   value = "%{ for member in ["one", "two", "three"] } member ${member}%{ endfor }"
// }

// output "test2" {
//   value = <<-EOT
//   %{ for member in ["one", "two", "three"] ~}        // removes unwanted spaces and new line characters
//   member ${member}
//   %{ endfor ~}"
//   EOT
// }


// -----------------------------------------------------------
// -----------------------------------------------------------
