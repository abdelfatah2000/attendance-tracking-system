<script>
  $(document).ready(function () {
      var pieData        = {
            labels: [
                'Students',
                'Staffs'
            ],
            datasets: [
              {
                data: [{{ student_count }},{{ staff_count }}],
                backgroundColor : ['#f56954', '#00a65a'],
              }
            ]
       };
  })
</script>