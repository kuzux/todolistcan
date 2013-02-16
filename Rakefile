task :server do |t|
    sh "unicorn config.ru"
end

task :migrate do |t|
    sh "sequel -m migrate sqlite://todo.sqlite3"
end

task :reset_db do |t|
    sh "rm todo.sqlite3"
    Rake::Task["migrate"].execute
end
