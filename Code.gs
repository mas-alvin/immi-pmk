/* 
  AL-KAS MASTER SCRIPT v5.0 - TOTAL FINANCE SYSTEM
  Mendukung: Login Terenkripsi, Iuran Anggota & Buku Catatan Keuangan Utama
*/

var MEMBER_SHEET  = "Anggota";
var CATATAN_SHEET = "Catatan";
var USER_SHEET    = "Users";       // Sheet baru untuk login

// ─────────────────────────────────────────────
//  ROUTING UTAMA
// ─────────────────────────────────────────────

function doGet(e) {
  try {
    var action = e.parameter.action || "getIuran";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ── LOGIN (GET) ────────────────────────────
    if (action === "login") {
      return handleLogin(e);
    }

    // ── GET CATATAN ────────────────────────────
    if (action === "getCatatan") {
      var sheet = ss.getSheetByName(CATATAN_SHEET);
      if (!sheet) return jsonResponse({ data: [] });
      var data = sheet.getDataRange().getValues().slice(2);
      var mapped = data.map(function(r) {
        return {
          tanggal : r[0],
          saldo   : parseFloat(r[1]) || 0,
          masuk   : parseFloat(r[2]) || 0,
          keluar  : parseFloat(r[3]) || 0,
          sisa    : parseFloat(r[4]) || 0,
          ket     : r[5]
        };
      });
      return jsonResponse({ data: mapped });
    }

    // ── GET IURAN (default) ────────────────────
    var bulan  = e.parameter.bulan;
    var tahun  = e.parameter.tahun;
    var sheetName = bulan + " " + tahun;
    var sheet  = ss.getSheetByName(sheetName) || setupNewMonthSheet(bulan, tahun);
    var memberSheet = ss.getSheetByName(MEMBER_SHEET);

    var members  = memberSheet
      ? memberSheet.getRange(1, 1, memberSheet.getLastRow(), 1).getValues().flat().filter(Boolean)
      : [];
    var dataRows = sheet.getDataRange().getValues().slice(2);

    var finalData = members.map(function(name, index) {
      var record = dataRows.find(function(r) {
        return r[1] && r[1].toString().trim().toLowerCase() === name.trim().toLowerCase();
      });
      return record
        ? { no: index+1, nama: name, t1: record[2], v1: record[3], m1: record[4], t2: record[5], v2: record[6], m2: record[7] }
        : { no: index+1, nama: name, t1: "", v1: 0, m1: "", t2: "", v2: 0, m2: "" };
    });

    return jsonResponse({ payments: finalData, memberList: members });

  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

function doPost(e) {
  try {
    var p  = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ── INPUT CATATAN MANUAL ───────────────────
    if (p.action === "addCatatan") {
      updateLedger(p.masuk || 0, p.keluar || 0, p.ket, p.tanggal);
      return jsonResponse({ status: "success" });
    }

    // ── INPUT IURAN ────────────────────────────
    if (p.action === "addIuran") {
      var sheetName = p.bulan + " " + p.tahun;
      var sheet     = ss.getSheetByName(sheetName) || setupNewMonthSheet(p.bulan, p.tahun);
      var data      = sheet.getDataRange().getValues();
      var rowIndex  = -1;
      var namaInput = p.nama.trim().toLowerCase();

      for (var i = 2; i < data.length; i++) {
        if (data[i][1] && data[i][1].toString().trim().toLowerCase() === namaInput) {
          rowIndex = i + 1;
          break;
        }
      }
      if (rowIndex === -1) throw new Error("Nama tidak ditemukan.");

      var tgl     = p.tanggal || new Date();
      var nominal = parseFloat(p.nominal) || 0;

      if (p.termin === "1") {
        sheet.getRange(rowIndex, 3).setValue(tgl);
        sheet.getRange(rowIndex, 4).setValue(nominal);
        sheet.getRange(rowIndex, 5).setValue(p.metode);
      } else {
        sheet.getRange(rowIndex, 6).setValue(tgl);
        sheet.getRange(rowIndex, 7).setValue(nominal);
        sheet.getRange(rowIndex, 8).setValue(p.metode);
      }

      // Otomatis masuk ke Catatan
      var ket = "Kas: " + p.nama.trim() + " (" + p.bulan + " " + p.tahun + " - Termin " + p.termin + ")";
      updateLedger(nominal, 0, ket, tgl);

      return jsonResponse({ status: "success" });
    }

    throw new Error("Action tidak dikenal: " + p.action);

  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

// ─────────────────────────────────────────────
//  LOGIN HANDLER
// ─────────────────────────────────────────────

function handleLogin(e) {
  var username = (e.parameter.username || "").trim().toLowerCase();
  var password = (e.parameter.password || "").trim();

  if (!username || !password) {
    return jsonResponse({ status: "error", message: "Username dan password wajib diisi." });
  }

  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(USER_SHEET);

  if (!sheet) {
    // Buat sheet Users otomatis jika belum ada
    sheet = setupUserSheet();
  }

  var rows = sheet.getDataRange().getValues().slice(1); // skip header

  for (var i = 0; i < rows.length; i++) {
    var rowUsername = (rows[i][0] || "").toString().trim().toLowerCase();
    var rowPassword = (rows[i][1] || "").toString().trim();
    var rowNama     = (rows[i][2] || rows[i][0] || "").toString().trim(); // Kolom C: Nama Lengkap

    // Bandingkan username + password (simpel; lihat catatan keamanan di bawah)
    if (rowUsername === username && rowPassword === password) {
      return jsonResponse({
        status   : "success",
        username : rowUsername,
        nama     : rowNama
      });
    }
  }

  return jsonResponse({ status: "error", message: "Username atau password salah." });
}

// ─────────────────────────────────────────────
//  LEDGER HELPERS
// ─────────────────────────────────────────────

function updateLedger(masuk, keluar, keterangan, tanggal) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CATATAN_SHEET) || setupCatatanSheet();
  var data  = sheet.getDataRange().getValues();
  var foundIndex = -1;
  var ketCari    = keterangan.toString().trim().toLowerCase();

  for (var i = 2; i < data.length; i++) {
    if (data[i][5] && data[i][5].toString().trim().toLowerCase() === ketCari) {
      foundIndex = i + 1;
      break;
    }
  }

  var tglValue = tanggal ? new Date(tanggal) : new Date();

  if (foundIndex !== -1) {
    // Update baris yang sudah ada (cegah double input)
    sheet.getRange(foundIndex, 1).setValue(tglValue);
    sheet.getRange(foundIndex, 3).setValue(masuk);
    sheet.getRange(foundIndex, 4).setValue(keluar);
    refreshBalances(sheet);
  } else {
    var lastRow  = sheet.getLastRow();
    var prevSisa = lastRow > 2 ? parseFloat(sheet.getRange(lastRow, 5).getValue()) || 0 : 0;
    var sisa     = prevSisa + (masuk || 0) - (keluar || 0);
    sheet.appendRow([tglValue, "", masuk || 0, keluar || 0, sisa, keterangan]);
    sheet.getRange(sheet.getLastRow(), 1, 1, 6).setBorder(true, true, true, true, true, true);
  }
}

function refreshBalances(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;
  var data    = sheet.getRange(3, 3, lastRow - 2, 2).getValues();
  var results = [];
  var saldo   = 0;
  for (var i = 0; i < data.length; i++) {
    saldo += (parseFloat(data[i][0]) || 0) - (parseFloat(data[i][1]) || 0);
    results.push([saldo]);
  }
  sheet.getRange(3, 5, results.length, 1).setValues(results);
}

// ─────────────────────────────────────────────
//  SETUP SHEETS
// ─────────────────────────────────────────────

function setupUserSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.insertSheet(USER_SHEET);

  // Header
  sheet.getRange("A1:C1")
    .setValues([["USERNAME", "PASSWORD", "NAMA LENGKAP"]])
    .setFontWeight("bold")
    .setBackground("#d9ead3")
    .setBorder(true, true, true, true, true, true);

  // Default admin account (WAJIB diganti setelah deploy!)
  sheet.getRange("A2:C2").setValues([["admin", "admin123", "Administrator IMMI"]]);

  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 250);
  return sheet;
}

function setupCatatanSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.insertSheet(CATATAN_SHEET);
  sheet.getRange("A1:F1").merge()
    .setValue("CATATAN KEUANGAN IMMI")
    .setFontSize(14).setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#ffe599");
  sheet.getRange("A2:F2")
    .setValues([["TANGGAL", "SALDO", "PEMASUKAN", "PENGELUARAN", "SISA SALDO", "KETERANGAN"]])
    .setFontWeight("bold")
    .setBackground("#cfe2f3")
    .setBorder(true, true, true, true, true, true);
  return sheet;
}

function setupNewMonthSheet(bulan, tahun) {
  var ss          = SpreadsheetApp.getActiveSpreadsheet();
  var name        = bulan + " " + tahun;
  var sheet       = ss.insertSheet(name);
  var memberSheet = ss.getSheetByName(MEMBER_SHEET);
  var members     = memberSheet
    ? memberSheet.getRange(1, 1, memberSheet.getLastRow(), 1).getValues().flat().filter(Boolean)
    : [];

  sheet.getRange("A1:I1").merge()
    .setValue(bulan.toUpperCase() + " " + tahun)
    .setFontSize(16).setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#f3f3f3");
  sheet.getRange("A2:I2")
    .setValues([["NO","NAMA","TANGGAL","PEMBAYARAN 1","METODE PEMBAYARAN 1","TANGGAL","PEMBAYARAN 2","METODE PEMBAYARAN 2","TOTAL PER ORANG"]])
    .setBackground("#d9ead3").setFontWeight("bold")
    .setBorder(true, true, true, true, true, true);

  if (members.length > 0) {
    var rows = members.map(function(m, i) {
      return [i+1, m, "", 0, "", "", 0, "", "=D"+(i+3)+"+G"+(i+3)];
    });
    sheet.getRange(3, 1, rows.length, 9).setValues(rows).setBorder(true, true, true, true, true, true);
  }
  sheet.setColumnWidth(2, 250);
  return sheet;
}

// ─────────────────────────────────────────────
//  UTILITAS
// ─────────────────────────────────────────────

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
